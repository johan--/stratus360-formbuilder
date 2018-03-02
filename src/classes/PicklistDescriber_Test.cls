@isTest
public class PicklistDescriber_Test {
    @isTest
    public static void testDescribeId(){
        S360_FA__Dummy_Object__c dummyObject = new S360_FA__Dummy_Object__c(S360_FA__Game_Type__c = 'Game1',S360_FA__Last_Name__c = 'AA', S360_FA__Date_Time__c = date.today());
        insert dummyObject; 
       	
        List<Dummy_Object__c> dObject = [SELECT id, S360_FA__Game_Type__c FROM S360_FA__Dummy_Object__c];
        
		List<String> plv = PicklistDescriber.describeID(dObject[0].Id, 'S360_FA__Game_Type__c');
              
    }
    
	@isTest
    public static void testGetDescribe(){
        Profile p = [select Id from Profile where Name = 'System Administrator'];
        User usr = new User(LastName='lastName', Alias='alias', Email='last@name.com', Username='lstN@xx.co', CommunityNickname='name', ProfileId = p.Id,
                         EmailEncodingKey='UTF-8', LanguageLocaleKey='en_US', LocaleSidKey='en_US', TimeZoneSidKey='America/New_York');
        
        String vendorRecord = Schema.SObjectType.S360_FA__Dummy_Object__c.getRecordTypeInfosByName().get('Record Type A').getName();
        
        Schema.SObjectType detail = Schema.getGlobalDescribe().get('S360_FA__Dummy_Object__c');
        Schema.SObjectField field = detail.getDescribe().fields.getMap().get('S360_FA__Game_Type__c');
        Schema.DescribeFieldResult descField = field.getDescribe();
        List<Schema.PicklistEntry> ple = descField.getPicklistValues();
        
        PageReference pageRef = Page.PicklistDesc;
        pageRef.getParameters().put('sobjectType', 'S360_FA__Dummy_Object__c');
        pageRef.getParameters().put('recordTypeName', 'S360_FA__Record_Type_A ');
        pageRef.getParameters().put('pickListFieldName', 'S360_FA__Game_Type__c');
        Test.setCurrentPage(pageRef);
        
        Test.startTest();
        
        Map<String,List<String>> mapPlv = PicklistDescriber.describe('S360_FA__Dummy_Object__c', 'S360_FA__Record_Type_A ', new String[]{'S360_FA__Game_Type__c'});
        List<String> plv = mapPlv.get(vendorRecord+'S360_FA__Game_Type__c');
        
        
        Test.stopTest();
    }
    
    @isTest
    public static void testGetDescribeAll(){
        Schema.SObjectType detail = Schema.getGlobalDescribe().get('S360_FA__Dummy_Object__c');
        Schema.SObjectField field = detail.getDescribe().fields.getMap().get('S360_FA__Game_Type__c');
        Schema.DescribeFieldResult descField = field.getDescribe();
        List<Schema.PicklistEntry> ple = descField.getPicklistValues();
        
        Map<String,List<String>> mapPlv = PicklistDescriber.describeAll('S360_FA__Dummy_Object__c', new String[]{'S360_FA__Game_Type__c'});
        List<String> plv = mapPlv.get('S360_FA__Game_Type__c');
        
        
        //System.assertEquals(ple.size(), plv.size());
        integer i = 0;
        for(Schema.PicklistEntry pe : ple){
            //System.assertEquals(pe.getLabel(), plv.get(i));
            i++;
        }
    }
}