@isTest
public class S360_Base_FileUploadController_Test {
	
	@isTest
    public static void testSaveTheFile(){
        Attachment test = new Attachment();
        
        S360_FA__Dummy_Object__c v1 = new S360_FA__Dummy_Object__c();
        v1.S360_FA__Last_Name__c = 'bvbb';
        v1.S360_FA__Date_Time__c = date.today();
        insert v1;
        
        Id testParentId = v1.id;
        String testName = 'test';
        String testBase64 = 'test';
        String testContentType = 'testContentType';
        
        Id result = S360_Base_FileUploadController.saveTheFile(testParentId, testName, testBase64, testContentType);
        Attachment a = new Attachment();
        a = [SELECT ParentId, Name, Body, ContentType FROM Attachment WHERE Id =: result][0];        
        
		Attachment savedAttach = a;		
		Attachment expectedAttach = new Attachment();
        
		expectedAttach.ParentId = testParentId;
        expectedAttach.Name = testName;
        expectedAttach.Body = EncodingUtil.base64Decode(testBase64);
        expectedAttach.ContentType = testContentType;
        
        // System.debug('Expects: ' + expectedAttach);
        // System.debug('Saved: ' + savedAttach);

        System.assert(expectedAttach.ParentId == savedAttach.ParentId);
        System.assert(expectedAttach.Name == savedAttach.Name);       
        System.assert(expectedAttach.Body == savedAttach.Body);
        System.assert(expectedAttach.ContentType == savedAttach.ContentType);            
    }
    
    @isTest
    public static void testAppendToFile(){
        String body = 'test';
        String toAppend = 'append';
        S360_FA__Dummy_Object__c dummy = new S360_FA__Dummy_Object__c();
        dummy.S360_FA__Last_Name__c = 'bvbb';
        dummy.S360_FA__Date_Time__c = date.today();
        insert dummy;

        Id testId = dummy.Id;

        Attachment test = new Attachment();
        test.ParentId = testId;
        test.Name = 'testattach';
        test.Body = EncodingUtil.base64Decode(body);

        insert test;

        String originalBody = EncodingUtil.base64Encode(test.Body);
        
        S360_Base_FileUploadController.appendToFile(test.Id, toAppend);

        // String appended = EncodingUtil.base64Encode(test.Body);
        // String expected = EncodingUtil.base64Encode(String.append(body, toAppend));

        // System.debug('Appended is : ' + test.Body + 'And Expected is : ' + (EncodingUtil.base64Decode('test')));

        // System.assert(EncodingUtil.base64Decode(body + toAppend) == test.Body);



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

        Id testID = (S360_Base_FileUploadController.saveTheChunk(testParentId, testName, testBase64, testContentType, ''));

        S360_Base_FileUploadController.saveTheChunk(testParentId, testName, testBase64, testContentType, testId);
    }

    @isTest
    public static void testRetrieveImageId(){
        S360_FA__Dummy_Object__c parent = new S360_FA__Dummy_Object__c();
        parent.S360_FA__Last_Name__c = 'testlast';
        parent.S360_FA__Date_Time__c = date.today();
        insert parent;

        Id result = S360_Base_FileUploadController.retrieveImageId(parent.Id);

        Id result2 = S360_Base_FileUploadController.retrieveImageId(result);
    }

    @isTest
    public static void testSaveRecords(){
        String testObjectType = 'S360_FA__Dummy_Object__com';
        String[] testPopulated = new String[5];
        List<S360_FA__Dummy_Object__c> testRecords = new List<S360_FA__Dummy_Object__c>();

        testPopulated[0] = 'a';
        testPopulated[1] = 'b';
        testPopulated[2] = 'c';

        S360_Base_FileUploadController.saveRecords(testObjectType, testPopulated, testRecords);

        testObjectType = 'S360_FA__Dummy_Object__c';

        S360_FA__Dummy_Object__c a = new S360_FA__Dummy_Object__c();
        S360_FA__Dummy_Object__c b = new S360_FA__Dummy_Object__c();
        S360_FA__Dummy_Object__c c = new S360_FA__Dummy_Object__c();

        testRecords.add(a);
        testRecords.add(b);
        testRecords.add(c);

        S360_Base_FileUploadController.saveRecords(testObjectType, testPopulated, testRecords);
        S360_Base_FileUploadController.saveRecords(testObjectType, testPopulated, NULL);

        
    }
}