public class S360_Base_PrintButtonController {
    @AuraEnabled
    public static String downloadTemplate(String attachmentId){
        system.debug(attachmentId);
        Attachment[] attch = [select id, body from Attachment where Id = :attachmentId];
        System.debug(EncodingUtil.base64Encode(attch[0].body));
        if(attch.size() > 0){
            return EncodingUtil.base64Encode(attch[0].body);
        }else{
            return '';
        }   
    }
    
    @AuraEnabled
    public static Id saveTheFile(Id parentId, String fileName, String base64Data, String contentType) { 
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
        
        Attachment a = new Attachment();
        a.parentId = parentId;

        a.Body = EncodingUtil.base64Decode(base64Data);
        a.Name = fileName;
        a.ContentType = contentType;
        
        insert a;
        
        return a.Id;
    }
    
    @AuraEnabled
    public static Id saveTheChunk(Id parentId, String fileName, String base64Data, String contentType, String fileId) { 
        if (fileId == '') {
            fileId = saveTheFile(parentId, fileName, base64Data, contentType);
        } else {
            appendToFile(fileId, base64Data);
        }
        return Id.valueOf(fileId);
    }

    public static void appendToFile(Id fileId, String base64Data) {
        
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
        
        Attachment a = [
            SELECT Id, Body
            FROM Attachment
            WHERE Id = :fileId
        ];
        
     	String existingBody = EncodingUtil.base64Encode(a.Body);
        a.Body = EncodingUtil.base64Decode(existingBody + base64Data); 

        update a;
    }
}