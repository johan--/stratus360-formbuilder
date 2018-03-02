@isTest
public class FormBuilder_Test {

    @isTest
    public static void testGetComponentConfig(){
        FormBuilder.getComponentConfig('', '');
        FormBuilder.getComponentConfig('', '1');

        S360_FA__S360_Form_Config__c test = new S360_FA__S360_Form_Config__c();
        String testJson = 'test';

        test.S360_FA__JSON__c = testJson;
        test.Name = 'test';
        insert test;

        FormBuilder.getComponentConfig('test', '1');
    }
}