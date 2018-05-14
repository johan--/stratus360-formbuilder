public with sharing class S360_Base_FileUploadController {

    @AuraEnabled
    public static Id saveTheFile(Id parentId, String fileName, String base64Data, String contentType) {
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');

        Attachment a = new Attachment();
        a.parentId = parentId;

        a.Body = EncodingUtil.base64Decode(base64Data);
        a.Name = fileName;
        a.ContentType = contentType;

        insert a;
        system.debug('aId:'+a.Id);

        return a.Id;
    }
	
    @AuraEnabled
    public static void createNewAttachmentMapper(Id parentId, string attachId, string fieldName, string fileName){
        S360_FA__AttachmentMapper__c am = new S360_FA__AttachmentMapper__c();
        am.S360_FA__Dummy_Object__c	 = parentId;
        am.S360_FA__attachId__c = attachId;
        am.S360_FA__fileName__c = fileName;
        am.S360_FA__fieldName__c = fieldName;
        
        upsert am;
    }
    
    @AuraEnabled
    public static List<S360_FA__AttachmentMapper__c> getAttachmentList(String parentId){
        List<S360_FA__AttachmentMapper__c> lists = new List<S360_FA__AttachmentMapper__c>();
        try{
        	lists = [SELECT S360_FA__fileName__c, S360_FA__fieldName__c FROM S360_FA__AttachmentMapper__c WHERE S360_FA__Dummy_Object__c=:parentId];    
        }catch(QueryException e){
            System.debug(e);
        }
       	
        return lists;
    }
    
    public static void appendToFile(Id fileId, String base64Data) {
        system.debug('passed fileId:'+fileId);

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

    @AuraEnabled
    public static Id saveTheChunk(Id parentId, String fileName, String base64Data, String contentType, String fileId) {
        if (fileId == '') {
            fileId = saveTheFile(parentId, fileName, base64Data, contentType);
        } else {
            appendToFile(fileId, base64Data);
        }
        system.debug('fileId:'+fileId);
        return Id.valueOf(fileId);
    }

    @AuraEnabled
    public static Id retrieveImageId(Id parentId) {
        List <Attachment> listOfImage = [SELECT Id,Name,ParentId FROM Attachment where ParentId = :parentId limit 1];
        if (listOfImage.size() > 0)
        {
            return listOfImage[0].Id;
        }
        else
        {
            return null;
        }

    }

    @AuraEnabled
    public static Map<String, Object> saveRecords(String soBjectType, String[] fieldPopulated, List<SObject> records){
        List<Map<String, Object>> errors = new List<Map<String, Object>>();
        List<String> noSuchColumnError= new List<String>();
        
        try{
            Map<String,Schema.sObjectType> refMap = new Map<String,Schema.sObjectType>();
            
            //check does field is lookup/reference type
            Schema.DescribeSobjectResult[] result = Schema.describeSObjects(new String[]{soBjectType});
            for(String fp : fieldPopulated){
                try{
                 	Schema.DescribeFieldResult fResult = result[0].fields.getMap().get(fp).getDescribe();
                    if(fResult.getReferenceTo().size() > 0){
                        refMap.put(fp, fResult.getReferenceTo()[0]);
                    }
                }catch(Exception e){
                    // Error: Attempt to de-reference a null object when get map field value
                    noSuchColumnError.add(fp);
                }
            }
            
            if(noSuchColumnError.size() > 0){
                String tmpNoSuchColumnError = 'No such columns [';
                
                tmpNoSuchColumnError += noSuchColumnError.get(0);
                for(integer i = 1; i < noSuchColumnError.size(); i++){
                    tmpNoSuchColumnError += ', '+noSuchColumnError.get(0);
                }
                tmpNoSuchColumnError += '] on '+soBjectType;
                
                return S360_Base_ServerResult.returnMessage(false, new String[]{tmpNoSuchColumnError});
            }
            
            insert records;
            return S360_Base_ServerResult.returnMessage(true, null);
        }catch(System.DmlException e){
            for (Integer i = 0; i < e.getNumDml(); i++) {
                Map<String, Object> error = new Map<String, Object>();
                
                error.put('line', e.getDmlIndex(i) + 1);
                error.put('message', e.getDmlMessage(i));
                
                errors.add(error);
            }
            
            List<String> msg = new List<String>();
            msg.add('Error: insert record');
            
            
            return S360_Base_ServerResult.returnMessage(false, msg, errors);
        }catch(Exception e){
            List<String> msg = new List<String>();
            msg.add('Error: ' + e.getMessage());
            
            
            return S360_Base_ServerResult.returnMessage(false, msg);
        }
    }
}