@isTest
public class S360_Base_FileUploadTableController_Test {
    public static Attachment att;

    @isTest
    public static void initTest() {
        EmailMessage email = new EmailMessage();
        email.subject = 'test email';
        insert email;

        att = new Attachment();
        att.name = 'test';
        att.ParentId = email.id;
        att.Body = Blob.valueOf('test body');
        insert att;
    }

    @isTest
    public static void testGetObjectAttachment(){
        initTest();

        String testFilterCondition = '';
        decimal testPOffset = 0;
        decimal testPSize = 1;
        String testSortDirection = 'asc';
        String testOrderBy = 'Name';

        S360_Base_FileUploadTableController.getObjectAttachment
            (
            testFilterCondition, testPOffset, testPSize, testSortDirection, testOrderBy
            );
        
        testFilterCondition = NULL;
        testPOffset = 5;
        testPSize = 1;
        testSortDirection = 'asc';
        testOrderBy = 'Name';

        S360_Base_FileUploadTableController.getObjectAttachment
            (
            testFilterCondition, testPOffset, testPSize, testSortDirection, testOrderBy
            );
        
        testFilterCondition = 'Name != null';
        testPOffset = 600;
        testPSize = 1;
        testSortDirection = 'asc';
        testOrderBy = 'Name';

        S360_Base_FileUploadTableController.getObjectAttachment
            (
            testFilterCondition, testPOffset, testPSize, testSortDirection, testOrderBy
            );

        testFilterCondition = 'Name = null';
        testPOffset = 500;
        testPSize = 1;
        testSortDirection = 'asc';
        testOrderBy = 'Name';

        S360_Base_FileUploadTableController.getObjectAttachment
                (
                        testFilterCondition, testPOffset, testPSize, testSortDirection, testOrderBy
                );
    }

    @isTest
    public static void testGetExpenseHelper(){
        initTest();
        S360_Base_FileUploadTableController.getExpenseHelper
            (
                'test', 100, 4000, 'Name', 'Asc'
            );
    }

    @isTest 
    public static void testSaveTheChunk(){
        S360_FA__Dummy_Object__c parent = new S360_FA__Dummy_Object__c();
        parent.S360_FA__Last_Name__c = 'smth';
        parent.S360_FA__Date_Time__c = date.today();
        insert parent;

        Id testParentId = parent.Id;
        String testName = 'test';
        String testBase64 = 'test';
        String testContentType = 'testContentType';

        Id testID = (S360_Base_FileUploadTableController.saveTheChunk(testParentId, testName, testBase64, testContentType, ''));

        S360_Base_FileUploadTableController.saveTheChunk(testParentId, testName, testBase64, testContentType, testId);
    }

    @isTest
    public static void testDeleteAttachment(){
        Contact dummy = new Contact();
        dummy.LastName = 'bvbb';
        dummy.Birthdate = date.today();
        insert dummy;
        Id dummyId = dummy.Id;

        Attachment a = new Attachment();
        a.ParentId = dummyId;
        a.Name = 'testattach';
        a.Body = EncodingUtil.base64Decode('test');

        insert a;

        String aId = String.valueOf(a.id);

        S360_Base_FileUploadTableController.deleteAttachment(aId);
    }
}