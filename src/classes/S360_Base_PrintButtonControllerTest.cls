@isTest
public class S360_Base_PrintButtonControllerTest {
    @isTest
    public static void testDownloadTemplate(){
        Account a = new Account(Name='dummy account');
        insert a;
        
        Attachment attch = new Attachment();
        attch.parentId = a.Id;
        attch.Body = Blob.valueOf('test');
        attch.Name = 'test';
        attch.ContentType = 'txt';
        insert attch;
        
        String result = S360_Base_PrintButtonController.downloadTemplate(attch.Id);
        System.assertEquals(EncodingUtil.base64Encode(Blob.valueOf('test')), result);
    }
    
	@isTest
    public static void testSaveTheFile(){
        string base64data = EncodingUtil.base64Encode(Blob.valueOf('data'));
        string urlEncode = EncodingUtil.urlEncode(base64data, 'UTF-8');
        
        Account a = new Account(Name='dummy account');
        insert a;
        
        ID attachmentId = S360_Base_PrintButtonController.saveTheFile(a.Id, 'data name', urlEncode, 'txt');
        
        Attachment sFile = [SELECT Id,Name,ParentId,Body,ContentType FROM Attachment where Id = :attachmentId limit 1];
        
        System.assertEquals('data name', sFile.Name);
        System.assertEquals(a.Id, sFile.ParentId);
        System.assertEquals('txt', sFile.ContentType);
        System.assertEquals(Blob.valueOf('data').size(), sFile.Body.size());
    }
    
    @isTest
    public static void testSaveTheChunck(){
        string base64data1 = EncodingUtil.base64Encode(Blob.valueOf('complete'));
        string base64data2 = EncodingUtil.base64Encode(Blob.valueOf('upload'));
        string base64data3 = EncodingUtil.base64Encode(Blob.valueOf('data'));
        
        string urlEncode1 = EncodingUtil.urlEncode(base64data1, 'UTF-8');
        string urlEncode2 = EncodingUtil.urlEncode(base64data2, 'UTF-8');
        string urlEncode3 = EncodingUtil.urlEncode(base64data3, 'UTF-8');
        
        Account a = new Account(Name='dummy account');
        insert a;
        
        ID attachmentId1 = S360_Base_PrintButtonController.saveTheChunk(a.Id, 'data name', urlEncode1, 'txt', '');
        ID attachmentId2 = S360_Base_PrintButtonController.saveTheChunk(a.Id, 'data name', urlEncode2, 'txt', attachmentId1);
        ID attachmentId3 = S360_Base_PrintButtonController.saveTheChunk(a.Id, 'data name', urlEncode3, 'txt', attachmentId2);
        
        Attachment sFile = [SELECT Id,Name,ParentId,Body,ContentType FROM Attachment where Id = :attachmentId1 limit 1];
        
        System.assertEquals('data name', sFile.Name);
        System.assertEquals(a.Id, sFile.ParentId);
        System.assertEquals('txt', sFile.ContentType);
        System.assertEquals(Blob.valueOf('completeuploaddata').size(), sFile.Body.size());
    }
}