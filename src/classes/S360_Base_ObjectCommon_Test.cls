@isTest
public class S360_Base_ObjectCommon_Test {
    @isTest
    public static void testGetObjectPermission(){
        Schema.DescribeSObjectResult test = S360_FA__Dummy_Object__c.SObjectType.getDescribe();


        S360_Base_ObjectCommon.getObjectPermission(test);
    }

    @isTest
    public static void testGetFLS(){
        Schema.DescribeFieldResult testFR = S360_FA__Dummy_Object__c.Id.getDescribe();
        Schema.sObjectField testSchema = testFR.getSObjectField();

        Map<String,Schema.SObjectField> test = new Map<String,Schema.SObjectField>();

        test.put('test', testSchema);
        
        S360_Base_ObjectCommon.getFLS(test);
    }

    @isTest
    public static void testGet1ParentRefFLS(){
        Dummy_Object__c parent = new Dummy_Object__c();
        parent.S360_FA__Last_Name__c = 'smth';
        parent.S360_FA__Date_Time__c = date.today();
        insert parent;

        Id testParentId = parent.Id;

        Schema.DescribeFieldResult testFR = Attachment.Id.getDescribe();
        String testFA = 'Name';
        
        S360_Base_ObjectCommon.get1ParentRefFLS(testFR, testFA);
    }

    @isTest
    public static void testConvertIdTo15Digit(){
        Contact parent = new Contact();
        parent.LastName = 'smth';
        parent.Birthdate = date.today();
        insert parent;

        S360_Base_ObjectCommon.convertIdTo15Digit(parent);
        S360_Base_ObjectCommon.convertIdTo15Digit(NULL);
    }

}