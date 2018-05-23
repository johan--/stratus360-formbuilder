public with sharing class S360_Base_FileUploadController {
	   
    @AuraEnabled
    public static Id saveTheFile(Id parentId, String fileName, String base64Data, String contentType) {
        
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');

        Attachment a = new Attachment();
        
        if(Schema.sObjectType.Attachment.fields.parentId.isCreateable()){
        	a.parentId = parentId;    
        }
        
        if(Schema.sObjectType.Attachment.fields.Body.isCreateable()){
        	a.Body = EncodingUtil.base64Decode(base64Data);    
        }
        
        if(Schema.sObjectType.Attachment.fields.Name.isCreateable()){
            a.Name = fileName;
        }
        
        if(Schema.sObjectType.Attachment.fields.ContentType.isCreateable()){
         	a.ContentType = contentType;   
        }
        
        if(Schema.sObjectType.Attachment.isCreateable()){
        	insert a;
        }
        system.debug('aId:'+a.Id);

        return a.Id;
    }
    
    @AuraEnabled
    public static Boolean deleteAttachmentMapper(Id parentId, string fieldName, string attachId, string customObject){
        List<S360_FA__AttachmentMapper__c> am = Database.query('SELECT Id FROM S360_FA__AttachmentMapper__c WHERE ('+customObject+'=:parentId) AND (S360_FA__fieldName__c=:fieldName) AND (S360_FA__attachId__c=:attachId)');
        try{
            List<S360_FA__AttachmentMapper__c> checkIfMoreInstancesOfAttachment = Database.query('SELECT Id FROM  S360_FA__AttachmentMapper__c WHERE ('+customObject+'=:parentId) AND (S360_FA__fieldName__c!=:fieldName) AND (S360_FA__attachId__c=:attachId)');
            if(checkIfMoreInstancesOfAttachment.size()<1){
                	SObjectType attachmentFLS = Schema.getGlobalDescribe().get('Attachment');
                    Attachment attachment = [SELECT Id FROM Attachment WHERE Id=:attachId];
                	try{
                        if(attachmentFLS.getDescribe().isDeletable()){
                        	delete attachment;
                        }
                    }catch(DmlException e){
                        System.debug(e);
                    }
            }
            SObjectType attachmentMapperFLS = Schema.getGlobalDescribe().get('S360_FA__AttachmentMapper__c');
            if(attachmentMapperFLS.getDescribe().isDeletable()){
            	delete am;
                return true;
            }else{
                return false;
            }         
        }catch(DmlException e){
            System.debug(e);
        }
        return false;
    }
	
    @AuraEnabled
    public static Boolean createNewAttachmentMapper(Id parentId, string attachId, string fieldName, string fileName, string customObject){
        S360_FA__AttachmentMapper__c am = new S360_FA__AttachmentMapper__c();
        am.put(customObject, parentId);
        am.S360_FA__attachId__c = attachId;
        am.S360_FA__fileName__c = fileName;
        am.S360_FA__fieldName__c = fieldName;
        
        SObjectType attachmentMapperFLS = Schema.getGlobalDescribe().get('S360_FA__AttachmentMapper__c');
        if(attachmentMapperFLS.getDescribe().isCreateable()){
        	insert am;
            return true;
        }else{
        	return false;
        }
    }
    
    @AuraEnabled
    public static List<S360_FA__AttachmentMapper__c> getAttachmentList(String parentId, String fieldName, String customObject){
        List<S360_FA__AttachmentMapper__c> lists = new List<S360_FA__AttachmentMapper__c>();
        try{
            lists = Database.query('SELECT S360_FA__attachId__c, S360_FA__fileName__c, S360_FA__fieldName__c FROM S360_FA__AttachmentMapper__c WHERE ('+customObject+'=:parentId) AND (S360_FA__fieldName__c!=:fieldName)');   
        }catch(QueryException e){
            System.debug(e);
        }
       	
        return lists;
    }
    
    @AuraEnabled
    public static List<S360_FA__AttachmentMapper__c> getMyAttachmentList(String parentId, String fieldName, String customObject){
        List<S360_FA__AttachmentMapper__c> lists = new List<S360_FA__AttachmentMapper__c>();
        try{
            lists = Database.query('SELECT S360_FA__attachId__c, S360_FA__fileName__c, S360_FA__fieldName__c FROM S360_FA__AttachmentMapper__c WHERE ('+customObject+'=:parentId) AND (S360_FA__fieldName__c=:fieldName)');
        }catch(QueryException e){
            System.debug(e);
        }
       	
        return lists;
    }
    
    public static void appendToFile(Id fileId, String base64Data) {
        SObjectType attachmentFLS = Schema.getGlobalDescribe().get('Attachment');
        system.debug('passed fileId:'+fileId);

        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');

        Attachment a = [
            SELECT Id, Body
            FROM Attachment
            WHERE Id = :fileId
        ];

        String existingBody = EncodingUtil.base64Encode(a.Body);
        
        if(Schema.sObjectType.Attachment.fields.Body.isUpdateable() || Schema.sObjectType.Attachment.fields.Body.isCreateable()){
         	a.Body = EncodingUtil.base64Decode(existingBody + base64Data);   
        }
		
        if(Schema.sObjectType.Attachment.isUpdateable()){
        	update a;
        }
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