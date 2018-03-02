public with sharing class S360_Welcome_Modal_Controller {

    private final sObject mysObject;

    @AuraEnabled
    public static void setDismissWelcome(Id userId, Boolean isDismissed){
        User u = [SELECT Id FROM User WHERE Id = :userId];
        System.debug(u);

         if(Schema.SobjectType.User.isAccessible() && Schema.SobjectType.User.isUpdateable()) {
            update u;
         }
        //update u;
    
}
    @AuraEnabled
    public static string getAgreementPDFLink(){
        //Should only be 1 record
        //S360_PIF_cs__c customSetting = [SELECT Id, PIF_Agreement_EN__c FROM S360_PIF_cs__c LIMIT 1];
        return '';
    }

}