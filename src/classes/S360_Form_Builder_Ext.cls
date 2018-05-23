global with sharing class S360_Form_Builder_Ext {
    
    //public List<String> objectFields {get; private set;}
    public string objectFields {get; private set;}
    public String jsonConfig {get; set;}
    public Integer selectedVersion {get; set;}
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

    public S360_FA__S360_Form_Config__c formConfig {get; private set;}
    public List<SelectOption> versionList {get; private set;}
    private Attachment jsonAttachment;
    private Integer versionField;
	public S360_Form_Builder_Ext(ApexPages.StandardController stdCtrl){
        List<String> availableFields = new List<String>();
        formConfig = (S360_FA__S360_Form_Config__c)stdCtrl.getRecord();
        System.debug(formConfig);
        System.debug(stdCtrl);
		selectedVersion = Integer.valueOf([SELECT S360_FA__SelectedVersion__c from S360_FA__S360_Form_Config__c where id =:formConfig.Id][0].S360_FA__SelectedVersion__c);
        List<S360_FA__S360_Form_Config__c> versionConfig = [SELECT 	S360_FA__Version_No__c from S360_FA__S360_Form_Config__c where id =:formConfig.Id];
        versionField = Integer.valueOf(versionConfig[0].S360_FA__Version_No__c);
        versionList = new List<SelectOption>();
        for(Integer i = 0; i <= versionField; i++){
            versionList.add(new SelectOption(String.valueOf(i),String.valueOf(i)));
        }
        System.debug([SELECT S360_FA__Version_No__c from S360_FA__S360_Form_Config__c where id =:formConfig.Id]);
        // get primary object field list
        if(formConfig != null && formConfig.Primary_Object__c != null){
            String primaryObject = formConfig.Primary_Object__c;
            Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe();
            if(globalDescribe.get(primaryObject.toLowerCase()) != null){
                Schema.DescribeSObjectResult objectDescribe = globalDescribe.get(primaryObject.toLowerCase()).getDescribe();
                Map<String, Schema.SobjectField> fieldInfo = objectDescribe.fields.getMap();
                for(Schema.SobjectField f: fieldInfo.values()){
                    DescribeFieldResult dfr = f.getDescribe();
                    availableFields.add(dfr.getName());
                    if(dfr.getRelationshipName() !=null){
                        availableFields.add(dfr.getRelationshipName());
                    }
                }
            }
        }

        objectFields = '';
        try{
            objectFields=availableFields[0];
        	for(Integer i = 0; i<availableFields.size(); i++){
            	objectFields += ','+availableFields[i];
        }
        }catch(ListException e){
            System.debug(e);
        }

        // get json config data from attachment
        jsonConfig = '';
        //Attachment[] tmp = [select id, Name, Body, ParentId from Attachment where ParentId = :formConfig.Id];
        Attachment[] tmp = [select id, Name, Body, ParentId from Attachment where Name = :('form_' + formConfig.Id + '_v' + selectedVersion)];
        if(tmp.size() > 0){ 
            jsonAttachment = tmp[0];
            if(tmp[0].Body != null){
            	jsonConfig = tmp[0].Body.toString();
            }
        }else{
            jsonAttachment = new Attachment();
            if(Schema.sObjectType.Attachment.fields.ParentId.isCreateable() || Schema.sObjectType.Attachment.fields.ParentId.isUpdateable()){
             	jsonAttachment.ParentId = formConfig.Id;
            }
            
            if(Schema.sObjectType.Attachment.fields.Name.isCreateable() || Schema.sObjectType.Attachment.fields.Name.isUpdateable()){
             	jsonAttachment.Name = 'form_' + formConfig.Id + '_v' + selectedVersion;   
            }
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

        
        if(Schema.sObjectType.S360_FA__S360_Form_Config__c.isUpdateable()){
            update formConfig;
        }

        // upsert json config attachemnt
        if(jsonAttachment.Id != null){
            if(Schema.sObjectType.Attachment.isUpdateable()){
                if(Schema.sObjectType.Attachment.fields.Body.isUpdateable()){
                 	jsonAttachment.Body = blob.valueOf(jsonConfig);   
                }
       			update jsonAttachment;
            }
        }else{
            if(Schema.sObjectType.Attachment.isCreateable()){
                if(Schema.sObjectType.Attachment.fields.Body.isCreateable()){
                	jsonAttachment.Body = blob.valueOf(jsonConfig);    
                }
                
        		insert jsonAttachment;
            }
        }


        return null;
    }

    public PageReference saveAs(){
        
        if(Schema.sObjectType.S360_FA__S360_Form_Config__c.isUpdateable()){
            update formConfig;
        }


        // upsert json config attachemnt
        if(Schema.sObjectType.Attachment.fields.Id.isAccessible() || Schema.sObjectType.Attachment.fields.Id.isCreateable() || Schema.sObjectType.Attachment.fields.Id.isUpdateable()){
        	jsonAttachment.Id = null;    
        }
       	
		if(Schema.sObjectType.Attachment.fields.Body.isUpdateable() || Schema.sObjectType.Attachment.fields.Body.isCreateable()){
        	jsonAttachment.Body = blob.valueOf(jsonConfig);
        }
        if(Schema.sObjectType.Attachment.fields.Name.isUpdateable() || Schema.sObjectType.Attachment.fields.Name.isCreateable()){
        	jsonAttachment.Name = 'form_' + formConfig.Id + '_v' + (versionField+1);
        }
        if(Schema.sObjectType.Attachment.isCreateable()){
        	insert jsonAttachment;
        }
        List<S360_FA__S360_Form_Config__c> versionConfig = [SELECT S360_FA__Version_No__c from S360_FA__S360_Form_Config__c where id =:formConfig.Id];
        versionconfig[0].S360_FA__Version_No__c++;
        System.debug(versionconfig[0].S360_FA__Version_No__c);
        if(Schema.sObjectType.S360_FA__S360_Form_Config__c.isUpdateable()){
        	update(versionconfig);
        }
		
        List<S360_FA__S360_Form_Config__c> versionUpsert = [SELECT S360_FA__SelectedVersion__c from S360_FA__S360_Form_Config__c where id =:formConfig.Id];
        
        if(Schema.sObjectType.S360_FA__S360_Form_Config__c.fields.S360_FA__SelectedVersion__c.isUpdateable()){
         	versionUpsert[0].S360_FA__SelectedVersion__c = versionField+1;
        }
        
        if(Schema.sObjectType.S360_FA__S360_Form_Config__c.isUpdateable()){
        	update(versionUpsert);
        }
        
        PageReference acctPage = new ApexPages.StandardController(formConfig).view();
        acctPage.setRedirect(true);
        return acctPage;

    }
    
    public PageReference refreshPage() {
        List<S360_FA__S360_Form_Config__c> versionUpsert = [SELECT S360_FA__SelectedVersion__c from S360_FA__S360_Form_Config__c where id =:formConfig.Id];
        
        if(Schema.sObjectType.S360_FA__S360_Form_Config__c.fields.S360_FA__SelectedVersion__c.isUpdateable()){
         	versionUpsert[0].S360_FA__SelectedVersion__c = selectedVersion;
        }
        
        if(Schema.sObjectType.S360_FA__S360_Form_Config__c.isUpdateable()){
        	update(versionUpsert);
        }
        /*PageReference pageRef = new PageReference(ApexPages.currentPage().getUrl());
        System.debug(ApexPages.currentPage().getUrl());
		pageRef.setRedirect(true);
		return null;*/
        
        PageReference acctPage = new ApexPages.StandardController(formConfig).view();
        acctPage.setRedirect(true);
        return acctPage;
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