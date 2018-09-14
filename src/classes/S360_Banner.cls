public with sharing class S360_Banner {
    @AuraEnabled
    public static List<S360_FA__Banner_Slide__c> getBanner(String bannerName){
    	List<S360_FA__Banner_Slide__c> slides = [select S360_FA__Alt_Text__c, S360_FA__Image_Focus_Location_Left__c, S360_FA__Image_Focus_Location_Right__c, 
                                                                 S360_FA__Caption_Location_Top__c, S360_FA__Caption_Location_Left__c, S360_FA__Image_URL__c, 
                                                                 S360_FA__Height__c, S360_FA__Autoplay__c, S360_FA__Button_URL__c, 
                                                                 S360_FA__HTML_Text__c, Name from S360_FA__Banner_Slide__c 
                                                                 where S360_FA__Banner__r.Name = :bannerName];
    	return slides;
    }
}