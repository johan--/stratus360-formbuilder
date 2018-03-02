public class FormBuilder {
    @AuraEnabled
    public static String getComponentConfig(String formName,String formId){
        List<S360_Form_Config__c> formConfigs;
        if(formId != '')
        {
        	formConfigs = [select JSON__c from S360_Form_Config__c where id = :formId limit 1];
        }else
        {
            formConfigs = [select JSON__c from S360_Form_Config__c where name = :formName limit 1];
        }
        if(formConfigs.size()==1){
            return formConfigs[0].JSON__c;
        }else{
            return '';
        }
    }
}