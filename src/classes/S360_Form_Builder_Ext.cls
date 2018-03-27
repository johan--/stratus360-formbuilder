public class S360_Form_Builder_Ext {
    public List<String> objectFields {get; private set;}
    public String jsonConfig {get; set;}
    
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
        Attachment[] tmp = [select id, Name, Body, ParentId from Attachment where ParentId = :formConfig.Id];
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
        System.debug(jsonConfig);
        update formConfig;
        
        // upsert json config attachemnt
        jsonAttachment.Body = blob.valueOf(jsonConfig);
        upsert jsonAttachment;
        
        return null;
    }
    
    public PageReference autoSave(){
        return save();
    }
}