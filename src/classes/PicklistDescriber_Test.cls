@isTest
public class PicklistDescriber_Test {
    @isTest
    public static void testDescribeId(){
        Contact dummyObject = new Contact(LeadSource= 'Web',LastName = 'AA', Birthdate = date.today());
        insert dummyObject; 
       	
        List<Contact> dObject = [SELECT id, LeadSource FROM Contact];
        
		List<String> plv = PicklistDescriber.describeID(dObject[0].Id, 'LeadSource');
              
    }
    
	@isTest
    public static void testGetDescribe(){
        Profile p = [select Id from Profile where Name = 'System Administrator'];
        User usr = new User(LastName='lastName', Alias='alias', Email='last@name.com', Username='lstN@xx.co', CommunityNickname='name', ProfileId = p.Id,
                         EmailEncodingKey='UTF-8', LanguageLocaleKey='en_US', LocaleSidKey='en_US', TimeZoneSidKey='America/New_York');
        
        String vendorRecord = Schema.SObjectType.Contact.getRecordTypeInfosByName().get('Record Type A').getName();
        
        Schema.SObjectType detail = Schema.getGlobalDescribe().get('Contact');
        Schema.SObjectField field = detail.getDescribe().fields.getMap().get('LeadSource');
        Schema.DescribeFieldResult descField = field.getDescribe();
        List<Schema.PicklistEntry> ple = descField.getPicklistValues();
        
        PageReference pageRef = Page.PicklistDesc;
        pageRef.getParameters().put('sobjectType', 'Contact');
        pageRef.getParameters().put('recordTypeName', 'S360_FA__Record_Type_A ');
        pageRef.getParameters().put('pickListFieldName', 'LeadSource');
        Test.setCurrentPage(pageRef);
        
        Test.startTest();
        
        Map<String,List<String>> mapPlv = PicklistDescriber.describe('Contact', 'S360_FA__Record_Type_A ', new String[]{'LeadSource'});
        List<String> plv = mapPlv.get(vendorRecord+'LeadSource');
        
        
        Test.stopTest();
    }
    
    @isTest
    public static void testGetDescribeAll(){
        Schema.SObjectType detail = Schema.getGlobalDescribe().get('Contact');
        Schema.SObjectField field = detail.getDescribe().fields.getMap().get('LeadSource');
        Schema.DescribeFieldResult descField = field.getDescribe();
        List<Schema.PicklistEntry> ple = descField.getPicklistValues();
        
        Map<String,List<String>> mapPlv = PicklistDescriber.describeAll('Contact', new String[]{'LeadSource'});
        List<String> plv = mapPlv.get('LeadSource');
        
        
        //System.assertEquals(ple.size(), plv.size());
        integer i = 0;
        for(Schema.PicklistEntry pe : ple){
            //System.assertEquals(pe.getLabel(), plv.get(i));
            i++;
        }
    }
}