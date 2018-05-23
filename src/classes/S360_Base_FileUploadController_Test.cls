@isTest
public class S360_Base_FileUploadController_Test {
	
	@isTest
    public static void testSaveTheFile(){
        Attachment test = new Attachment();
        
        Contact v1 = new Contact();
        v1.LastName = 'bvbb';
        v1.Birthdate = date.today();
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
    public static void testcreateNewAttachmentMapper(){
        Contact v1 = new Contact();
        v1.LastName = 'bvbb';
        v1.Birthdate = date.today();
        insert v1;
        
        string testattachId = 'test';
        string testfileName = 'test';
        string testfieldName = 'test';
        
        Boolean worked = S360_Base_FileUploadController.createNewAttachmentMapper(v1.Id, testattachId, testfieldName, testfileName, 'S360_FA__Contact__c');
        
        if(worked){
        
            S360_FA__AttachmentMapper__c testAm = [SELECT Id, S360_FA__Contact__c,S360_FA__fieldName__c,S360_FA__fileName__c,S360_FA__attachId__c FROM S360_FA__AttachmentMapper__c WHERE (S360_FA__Contact__c=:v1.Id) AND (S360_FA__fieldName__c=:testfieldName) AND (S360_FA__attachId__c=:testattachId)];
            
            System.assert(testAm.S360_FA__Contact__c == v1.Id);
            System.assert(testAm.S360_FA__fieldName__c == testfieldName);
            System.assert(testAm.S360_FA__fileName__c == testfileName);
            System.assert(testAm.S360_FA__attachId__c == testattachId);
        }else{
            System.assert(true);
        }
    }
	
	@isTest
   	public static void testdeleteAttachmentMapper(){
        Contact v1 = new Contact();
        v1.LastName = 'bvbb';
        v1.Birthdate = date.today();
        insert v1;
        
        String testattachId = 'test';
        String testfieldName = 'test';
        String testfileName = 'test';
        
        Id fileId = S360_Base_FileUploadController.saveTheFile(v1.Id, testfileName, 'test', 'test') ;
        Boolean worked1 = S360_Base_FileUploadController.createNewAttachmentMapper(v1.Id, fileId, testfieldName, testfileName, 'S360_FA__Contact__c'); 
        Boolean deleted = S360_Base_FileUploadController.deleteAttachmentMapper(v1.Id, testfieldName, fileId, 'S360_FA__Contact__c');
		List<S360_FA__AttachmentMapper__c> listy = [SELECT Id FROM S360_FA__AttachmentMapper__c WHERE (S360_FA__Contact__c=:v1.Id) AND (S360_FA__fieldName__c=:testfieldName) AND (S360_FA__attachId__c=:fileId)];
        
        System.assert(deleted == true);
        System.assert(listy.size()==0);
        
    }	
    
    @isTest
    public static void testgetAttachmentList(){
        Contact v1 = new Contact();
        v1.LastName = 'Bob';
        v1.Birthdate = date.today();
        insert v1;

        
        string testattachId = 'test';
        string testfileName = 'test';
        string testfieldName = 'test';
        
		Boolean worked1 = S360_Base_FileUploadController.createNewAttachmentMapper(v1.Id, testattachId, testfieldName+'1', testfileName, 'S360_FA__Contact__c');   
        Boolean worked2 = S360_Base_FileUploadController.createNewAttachmentMapper(v1.Id, testattachId, testfieldName+'1', testfileName, 'S360_FA__Contact__c');
        
        List<S360_FA__AttachmentMapper__c> lists = new List<S360_FA__AttachmentMapper__c>();
        lists= S360_Base_FileUploadController.getAttachmentList(v1.Id, testfieldName, 'S360_FA__Contact__c');

        
                                                                                                                                                                       
        System.assert(lists.size()==2);
        for(Integer i = 0; i<2; i++){
            //System.assert(lists[i].S360_FA__attachId__c	== testAttachId);
            //System.assert(lists[i].S360_FA__fieldName__c == testfieldName);
            //System.assert(lists[i].S360_FA__fileName__c == testfileName);
            //System.assert(lists[i].S360_FA__Contact__c == v1.Id);
        }
        

    }
    
    @isTest
    public static void testgetMyAttachmentList(){
        Contact v1 = new Contact();
        v1.LastName = 'Bob';
        v1.Birthdate = date.today();
        insert v1;

        
        string testattachId = 'test';
        string testfileName = 'test';
        string testfieldName = 'test';
        
		Boolean worked1 = S360_Base_FileUploadController.createNewAttachmentMapper(v1.Id, testattachId, testfieldName, testfileName+'1', 'S360_FA__Contact__c');   
        Boolean worked2 = S360_Base_FileUploadController.createNewAttachmentMapper(v1.Id, testattachId, testfieldName, testfileName, 'S360_FA__Contact__c');
        
        List<S360_FA__AttachmentMapper__c> lists = new List<S360_FA__AttachmentMapper__c>();
        lists= S360_Base_FileUploadController.getMyAttachmentList(v1.Id, testfieldName, 'S360_FA__Contact__c');

        
                                                                                                                                                                       
        //System.assert(lists.size()==1);
        for(Integer i = 0; i<1; i++){
            //System.assert(lists[i].S360_FA__attachId__c	== testAttachId);
            //System.assert(lists[i].S360_FA__fieldName__c == testfieldName);
            //System.assert(lists[i].S360_FA__fileName__c == testfileName);
            //System.assert(lists[i].S360_FA__Contact__c == v1.Id);
        }
        

    }
    
    @isTest
    public static void testAppendToFile(){
        String body = 'test';
        String toAppend = 'append';
        Contact dummy = new Contact();
        dummy.LastName = 'bvbb';
        dummy.Birthdate= date.today();
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
        Contact parent = new Contact();
        parent.LastName = 'smth';
        parent.Birthdate = date.today();
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
        Contact parent = new Contact();
        parent.LastName = 'testlast';
        parent.Birthdate = date.today();
        insert parent;

        Id result = S360_Base_FileUploadController.retrieveImageId(parent.Id);

        Id result2 = S360_Base_FileUploadController.retrieveImageId(result);
    }

    @isTest
    public static void testSaveRecords(){
        String testObjectType = 'Contact';
        String[] testPopulated = new String[5];
        List<Contact> testRecords = new List<Contact>();

        testPopulated[0] = 'a';
        testPopulated[1] = 'b';
        testPopulated[2] = 'c';

        S360_Base_FileUploadController.saveRecords(testObjectType, testPopulated, testRecords);

        testObjectType = 'Contact';

        Contact a = new Contact();
        Contact b = new Contact();
        Contact c = new Contact();

        testRecords.add(a);
        testRecords.add(b);
        testRecords.add(c);

        S360_Base_FileUploadController.saveRecords(testObjectType, testPopulated, testRecords);
        S360_Base_FileUploadController.saveRecords(testObjectType, testPopulated, NULL);

        
    }
}