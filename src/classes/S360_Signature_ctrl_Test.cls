@isTest
public class S360_Signature_ctrl_Test {
	@isTest
    public static void testUploadDownloadSignature(){
        Account a = new Account(Name = 'account');
        insert a;
        
        String data = 'test';
        String result1 = S360_Signature_Ctrl.upsertSignature('', EncodingUtil.base64Encode(blob.valueOf(data)));
        
        System.assert(result1 != '');
        
        String result2 = S360_Signature_Ctrl.upsertSignature(a.Id, EncodingUtil.base64Encode(blob.valueOf(data)));
        System.assertEquals('', result2);
        System.assertEquals(EncodingUtil.base64Encode(blob.valueOf(data)), S360_Signature_Ctrl.getSignature(a.Id));
        
        data = 'test2';
        String result3 = S360_Signature_Ctrl.upsertSignature(a.Id, EncodingUtil.base64Encode(blob.valueOf(data)));
        System.assertEquals('', result3);
        System.assertEquals(EncodingUtil.base64Encode(blob.valueOf(data)), S360_Signature_Ctrl.getSignature(a.Id));
    }
}