public class S360_Base_Carousel {
    @AuraEnabled
    public static /*Map<String,Object>*/ List<Sobject> getCarousel(String lookupParentField, 
                                                 String parentId, 
                                                 String carouselObject,
                                                 String carouselCaptionField,
                                                 String carouselTypeField,
                                                 String carouselVideoTypeField,
                                                 String carouselVideoIdField){
                                                     Map<String, Object> data = new Map<String, Object>();
                                                     
                                                     String query = 'select ' + carouselCaptionField + ',' + carouselTypeField + ',' + carouselVideoTypeField + ',' + carouselVideoIdField 
                                                         + ', (select id, Name from Attachments) attc from ' + carouselObject + ' where ' + lookupParentField + '= \'' + parentId + '\'';
                                                     List<sObject> carousels = Database.query(query);
                                                     /*data.put('carousel', carousels);
                                                     
                                                     Map<String, Object> attachments = new Map<String, Object>();
                                                     for(sobject c : carousels){
                                                         List<sobject> attch = new List<sobject>();
                                                         if(c.getSObjects('Attachments') != null){
                                                             attachments.put(String.valueOf(c.get('Id')), c.getSObjects('Attachments'));
                                                         }
                                                     }
                                                     data.put('attachments', attachments);
                                                     
                                                     
                                                     return data;*/
                                                     
                                                     return carousels;
                                                 }
}