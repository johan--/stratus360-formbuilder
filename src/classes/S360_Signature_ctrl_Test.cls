@isTest
public class S360_Signature_ctrl_Test {
	@isTest
    public static void testuploadSignature(){
        S360_Form_Config__c test = new S360_Form_Config__c();
        test.Name = 'test';
        test.JSON__c = '';
        test.Primary_Object__c = 'S360_FA__Dummy_Object__c';
        test.Field__c = '';
        test.Component_Type__c = 'Custom';
        test.Custom_Css__c = '';
        test.Custom_Script__c = '';
    
        insert test;

        String testFormName = test.Name;
        String testRecordId = String.valueOf(test.Id);

        S360_Signature_Ctrl.uploadSignature(test.id, '');
        
        S360_Signature_Ctrl.upsertSignature(test.id, '','');
    }
}