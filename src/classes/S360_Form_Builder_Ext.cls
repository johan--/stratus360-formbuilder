public class S360_Form_Builder_Ext {
    public List<String> objectFields {get; private set;}
    
	public S360_Form_Builder_Ext(ApexPages.StandardController stdCtrl){
        List<String> availableFields = new List<String>();
        S360_FA__S360_Form_Config__c formConfig = (S360_FA__S360_Form_Config__c)stdCtrl.getRecord();
        
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
    }
}