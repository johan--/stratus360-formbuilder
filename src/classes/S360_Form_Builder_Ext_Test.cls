@isTest
public class S360_Form_Builder_Ext_Test {
    @isTest
    public static void testS360_Form_Builder_Ext(){
        S360_FA__S360_Form_Config__c testFormConfig = new S360_FA__S360_Form_Config__c();
        testFormConfig.Name = 'test form config';
        testFormConfig.S360_FA__Primary_Object__c = 'Account';
        
        insert testFormConfig;

        ApexPages.StandardController stdCtrla = new ApexPages.StandardController(testFormConfig);
        S360_Form_Builder_Ext a = new S360_Form_Builder_Ext(stdCtrla);
        
        System.assertEquals('', a.jsonConfig);
        
        // add jsonconfig
        a.jsonConfig = 'test';
        a.save();
        a.saveAs();
        ApexPages.StandardController stdCtrlb = new ApexPages.StandardController(testFormConfig);
        S360_Form_Builder_Ext b = new S360_Form_Builder_Ext(stdCtrlb);
        
        System.assertEquals('test', b.jsonConfig);
        
        b.jsonConfig = 'test-dummy';
        b.autoSave();
        
        ApexPages.StandardController stdCtrlc = new ApexPages.StandardController(testFormConfig);
        S360_Form_Builder_Ext c = new S360_Form_Builder_Ext(stdCtrlc);
        a.refreshPage();
        a.cloneForm();
        System.assertEquals('test-dummy', c.jsonConfig);
    }
    
    @isTest
    public static void testDoUploadAttachment(){
        S360_FA__S360_Form_Config__c testFormConfig = new S360_FA__S360_Form_Config__c();
        testFormConfig.Name = 'test form config';
        testFormConfig.S360_FA__Primary_Object__c = 'Account';
        
        insert testFormConfig;
        
        string base64data = EncodingUtil.base64Encode(Blob.valueOf('data'));
        
        ID attachmentId = S360_Form_Builder_Ext.doUploadAttachment((String)testFormConfig.Id, base64data, 'test.text', null);
        
        Attachment sFile = [SELECT Id,Name,ParentId,Body,ContentType FROM Attachment where Id = :attachmentId limit 1];
        
        System.assertEquals('test.text', sFile.Name);
        System.assertEquals(testFormConfig.Id, sFile.ParentId);
        System.assertEquals(Blob.valueOf('data').size(), sFile.Body.size());
    }
    
    @isTest
    public static void testSaveTheChunck(){
        string base64data1 = EncodingUtil.base64Encode(Blob.valueOf('complete'));
        string base64data2 = EncodingUtil.base64Encode(Blob.valueOf('upload'));
        string base64data3 = EncodingUtil.base64Encode(Blob.valueOf('data'));
        
        S360_FA__S360_Form_Config__c testFormConfig = new S360_FA__S360_Form_Config__c();
        testFormConfig.Name = 'test form config';
        testFormConfig.S360_FA__Primary_Object__c = 'Account';
        
        insert testFormConfig;
        
        ID attachmentId1 = S360_Form_Builder_Ext.doUploadAttachment((String)testFormConfig.Id, base64data1, 'test.text', null);
        ID attachmentId2 = S360_Form_Builder_Ext.doUploadAttachment((String)testFormConfig.Id, base64data2, 'test.text', attachmentId1);
        ID attachmentId3 = S360_Form_Builder_Ext.doUploadAttachment((String)testFormConfig.Id, base64data3, 'test.text', attachmentId2);
        
        Attachment sFile = [SELECT Id,Name,ParentId,Body,ContentType FROM Attachment where Id = :attachmentId1 limit 1];
        
        System.assertEquals('test.text', sFile.Name);
        System.assertEquals(testFormConfig.Id, sFile.ParentId);
        System.assertEquals(Blob.valueOf('completeuploaddata').size(), sFile.Body.size());
    }
}