public class S360_Base_Carousel {
    @AuraEnabled
    public static List<Sobject> getCarousel(String lookupParentField, 
                                                 String parentId, 
                                                 String carouselObject,
                                                 String carouselCaptionField,
                                                 String carouselTypeField,
                                                 String carouselVideoTypeField,
                                                 String carouselVideoIdField,
                                                 String carouselImageRedirectLinkField){
                                                     Map<String, Object> data = new Map<String, Object>();
                                                     
                                                     String query = 'select ' + carouselCaptionField + ',' + carouselTypeField + ',' + carouselVideoTypeField + ',' + carouselVideoIdField
                                                         + ',' + carouselImageRedirectLinkField
                                                         + ', (select id, Name from Attachments) attc from ' + carouselObject + ' where ' + lookupParentField + '= \'' + parentId + '\'';
                                                     System.debug(query);
                                                     List<sObject> carousels = Database.query(query);
                                                     
                                                     return carousels;
                                                 }
}