@isTest
public class S360_Base_Carousel_Test {
	@isTest
    public static void getCarousel(){
        S360_FA__Dummy_Object__c a = new S360_FA__Dummy_Object__c(S360_FA__First_Name__c='fs', S360_FA__Last_Name__c='ln', S360_FA__Date_Time__c=System.now());
        insert a;
        
        S360_FA__Carousel_Config__c b = new S360_FA__Carousel_Config__c(S360_FA__Dummy_Object__c = a.Id, S360_FA__Caption__c='caption',
                                                                       S360_FA__Type__c='image');
        insert b;
        
        Attachment attch = new Attachment();
        attch.parentId = b.Id;
        attch.Body = Blob.valueOf('test');
        attch.Name = 'test';
        attch.ContentType = 'txt';
        insert attch;
        
        List<Sobject> result = S360_Base_Carousel.getCarousel('S360_FA__Dummy_Object__c', a.id, 'S360_FA__Carousel_Config__c', 'S360_FA__Caption__c', 'S360_FA__Type__c', 'S360_FA__Video_Type__c', 
                                                              'S360_FA__Video_Id__c', 'S360_FA__Redirect_Link__c');
        System.assertEquals(1, result.size());
        System.assertEquals('caption', result.get(0).get('S360_FA__Caption__c'));
        System.assertEquals('image', result.get(0).get('S360_FA__Type__c'));
        
        sobject[] attchs = result.get(0).getSobjects('Attachments');
        
        System.assertEquals(attch.Id, (ID)attchs.get(0).get('Id'));
    }
}