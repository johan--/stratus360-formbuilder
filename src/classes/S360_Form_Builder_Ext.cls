global with sharing class S360_Form_Builder_Ext {
    public List<String> objectFields {get; private set;}
    public String jsonConfig {get; set;}
    /*public String printAttachmentId {get; set;}
    public String printAttachmentName {get; set;}
    public Attachment printAttachment {
        get {
            if (printAttachment == null)
                printAttachment = new Attachment();
            return printAttachment;
        }
        set;
    }*/
    
    private S360_FA__S360_Form_Config__c formConfig;
    private Attachment jsonAttachment;
    
	public S360_Form_Builder_Ext(ApexPages.StandardController stdCtrl){
        List<String> availableFields = new List<String>();
        formConfig = (S360_FA__S360_Form_Config__c)stdCtrl.getRecord();
        
        // get primary object field list
        if(formConfig != null && formConfig.Primary_Object__c != null){
            String primaryObject = formConfig.Primary_Object__c;
            Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe(); 
            if(globalDescribe.get(primaryObject.toLowerCase()) != null){        
                Schema.DescribeSObjectResult objectDescribe = globalDescribe.get(primaryObject.toLowerCase()).getDescribe();
                Map<String, Schema.SobjectField> fieldInfo = objectDescribe.fields.getMap();
                for(Schema.SobjectField f: fieldInfo.values()){
                    DescribeFieldResult dfr = f.getDescribe();
                    availableFields.add('"'+dfr.getName()+'"');
                    if(dfr.getRelationshipName() !=null){
                        availableFields.add('"'+dfr.getRelationshipName()+'"');
                    }
                }
            }
        }
        objectFields = availableFields;
        
        // get json config data from attachment
        jsonConfig = '';
        //Attachment[] tmp = [select id, Name, Body, ParentId from Attachment where ParentId = :formConfig.Id];
        Attachment[] tmp = [select id, Name, Body, ParentId from Attachment where Name = :('form_' + formConfig.Id)];
        if(tmp.size() > 0){
            jsonAttachment = tmp[0];
            if(tmp[0].Body != null){
            	jsonConfig = tmp[0].Body.toString();    
            }
        }else{
            jsonAttachment = new Attachment();
            jsonAttachment.ParentId = formConfig.Id;
            jsonAttachment.Name = 'form_' + formConfig.Id;
        }
        System.debug(jsonConfig);
        
        if(jsonConfig == null || jsonConfig == ''){
            S360_FA__S360_Form_Config__c tmpFormConfig = [select JSON__c from S360_FA__S360_Form_Config__c where Id = :formConfig.Id];
            if(tmpFormConfig.JSON__c == null){
                jsonConfig = '';
            }else{
             	jsonConfig =  tmpFormConfig.JSON__c;
            }
        }
        System.debug(jsonConfig);
        // end of get json config data from attachment
        
    }
    
    public PageReference save(){
        Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe();
        if(!globalDescribe.get('s360_fa__s360_form_config__c').getDescribe().isUpdateable()){
            return null;
        }
        update formConfig;
        
        // upsert json config attachemnt
        if(jsonAttachment.Id != null){
            if(!globalDescribe.get('attachment').getDescribe().isUpdateable()){
                return null;
            }
        }else{
            if(!globalDescribe.get('attachment').getDescribe().isCreateable()){
                return null;
            }
        }
        jsonAttachment.Body = blob.valueOf(jsonConfig);
        upsert jsonAttachment;
        
        return null;
    }
    
    public PageReference autoSave(){
        return save();
    }
    
    @RemoteAction
    public static String doUploadAttachment(String parentId, String attachmentBody, String attachmentName, String attachmentId) {
        if(attachmentBody != null) {
            Attachment att = getAttachment(attachmentId);
            String newBody = '';
            if(att.Body != null) {
                newBody = EncodingUtil.base64Encode(att.Body);
            }
            newBody += attachmentBody;
            att.Body = EncodingUtil.base64Decode(newBody);
            if(attachmentId == null) {
                System.debug(att.Body);
                System.debug(parentId);
                att.Name = attachmentName;
                att.parentId = parentId;
            }
            upsert att;
            return att.Id;
        } else {
            return 'Attachment Body was null';
        }
    }
    
    private static Attachment getAttachment(String attId) {
        list<Attachment> attachments = [SELECT Id, Body
                                        FROM Attachment 
                                        WHERE Id =: attId];
        if(attachments.isEmpty()) {
            Attachment a = new Attachment();
            return a;
        } else {
            return attachments[0];
        }
    }
}