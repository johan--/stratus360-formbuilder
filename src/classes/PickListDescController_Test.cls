@isTest
public class PickListDescController_Test {
    // @isTest
    // public static void test1(){
    //     String RecordName = Schema.SObjectType.Dummy_Object__c.getRecordTypeInfosByName().get('Record Type A').getName();
    //     Id RecordId = Schema.SObjectType.Dummy_Object__c.getRecordTypeInfosByName().get('Record Type A').getRecordTypeId();
        
    //     PageReference pageRef = Page.PicklistDesc;
    //     pageRef.getParameters().put('sobjectType', 'Dummy_Object__c');
    //     pageRef.getParameters().put('recordTypeName', RecordName);
    //     pageRef.getParameters().put('pickListFieldName', 'Game_type__c');

    //     Test.setCurrentPage(pageRef);
        
    //     Test.startTest();
    //     PickListDescController pdc = new PickListDescController();
        
    //     System.assertEquals(RecordId, (Id)(pdc.sobj.get('RecordTypeId')));
        
    //     Test.stopTest();
        
    // 
    
    @isTest
    public static void test2(){
        String vendorRecordName = Schema.SObjectType.S360_FA__Dummy_Object__c.getRecordTypeInfosByName().get('Record Type A').getName();
        System.debug('vendor: ' + vendorRecordName);
        Id vendorRecordId = Schema.SObjectType.S360_FA__Dummy_Object__c.getRecordTypeInfosByName().get('Record Type A').getRecordTypeId();
        System.debug('vendorrecordid: ' + vendorRecordId);
        
        PageReference pageRef = Page.PicklistDesc;

        //vendorRecordName = String.valueOf([SELECT DeveloperName FROM RecordType WHERE Id =: vendorRecordId][0]);
        System.debug(vendorRecordName);

        vendorRecordName = vendorRecordName.replace(' ', '_');

        pageRef.getParameters().put('sobjectType', 'S360_FA__Dummy_Object__c');
        pageRef.getParameters().put('recordTypeId', vendorRecordId);
        pageRef.getParameters().put('recordTypeName', vendorRecordName);
        pageRef.getParameters().put('pickListFieldName', 'S360_FA__Game_type__c');
        Test.setCurrentPage(pageRef);
        
        Test.startTest();
        PickListDescController pdc = new PickListDescController();
        
        System.assertEquals(vendorRecordId, (Id)(pdc.sobj.get('RecordTypeId')));
        
        Test.stopTest();
        
    }
    
    
    @isTest
    public static void test3(){
        Dummy_Object__c dummyObject = new Dummy_Object__c(Game_Type__c = 'Game1');
        dummyObject.Last_Name__c = 'test';
        dummyObject.Date_Time__c = date.today();
        insert dummyObject;
        
        PageReference pageRef = Page.PicklistDesc;
        pageRef.getParameters().put('id', dummyObject.Id);
        pageRef.getParameters().put('pickListFieldName', 'Game_type__c');
        Test.setCurrentPage(pageRef);
        
        Test.startTest();
        PickListDescController pdc = new PickListDescController();
        
        
        Test.stopTest();
        
        
    }
}