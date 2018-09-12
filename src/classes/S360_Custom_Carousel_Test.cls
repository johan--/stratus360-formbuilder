@isTest
public class S360_Custom_Carousel_Test {
    @isTest
    public static void getCarousel(){
        
        string carouselTestName = 'Custom Carousel Test';
        S360_FA__Custom_Carousel__c cc = new S360_FA__Custom_Carousel__c(Name = carouselTestName);
        
        insert cc;
        
        List<S360_FA__Custom_Carousel_Slide__c> a = new List<S360_FA__Custom_Carousel_Slide__c>();
        
        for(integer i = 0; i < 3; i++) {
            string name = string.valueOf(i);
            string imageLabel = 'image ' + name;
            S360_FA__Custom_Carousel_Slide__c ccs = new S360_FA__Custom_Carousel_Slide__c(Name = name,
                                                                                          S360_FA__Height__c = 0, 
                                                                                          S360_FA__Alt_Text__c = imageLabel, 
                                                                                          S360_FA__Custom_Carousel__c = cc.Id, 
                                                                                          S360_FA__Autoplay__c = false);
            insert ccs;
            a.add(ccs);
        }
        
		System.assertEquals(S360_Custom_Carousel.getCarousel(carouselTestName), a);  
    }
}