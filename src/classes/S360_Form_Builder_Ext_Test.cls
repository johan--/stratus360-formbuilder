@isTest
public class S360_Form_Builder_Ext_Test {
    @isTest
    public static void testS360_Form_Builder_Ext(){
        S360_FA__S360_Form_Config__c testFormConfig = new S360_FA__S360_Form_Config__c();
        testFormConfig.Name = 'test form config';
        testFormConfig.S360_FA__Primary_Object__c = 'Account';
        
        insert testFormConfig;

        ApexPages.StandardController stdCtrl = new ApexPages.StandardController(testFormConfig);

        S360_Form_Builder_Ext a = new S360_Form_Builder_Ext(stdCtrl);
    }
}