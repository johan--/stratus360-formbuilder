@isTest
public class S360_Form_Builder_Controller_Test {
    @isTest
    public static void testGetComponentConfig(){
        S360_Form_Config__c test = new S360_Form_Config__c();
        test.Name = 'test';
        test.JSON__c = '';
        test.Primary_Object__c = 'Contact';
        test.Field__c = '';
        test.Component_Type__c = 'Custom';
        test.Custom_Css__c = '';
        test.Custom_Script__c = '';
    
        insert test;

        String testFormName = test.Name;
        String testRecordId = String.valueOf(test.Id);

        S360_Form_Builder_Controller.getComponentConfig(testFormName, testRecordId,'en');
        S360_Form_Builder_Controller.getComponentConfig('', testRecordId,'en');
        S360_Form_Builder_Controller.getComponentConfig('', '','en');
    }

    @isTest
    public static void testSaveUpsertRecord(){
        Account testAcc = new Account();
        testAcc.name = 'Test account';

        Map<object, object> testChild = new Map<object, object>();
        testChild.put('sobjectType', 'Account');

        Map<String, List<object>> testMap = new Map<String, List<object>>();
        List<object> testList = new List<object>();

        testList.add(testChild);
        testMap.put('Child|id|Test', testList);
        S360_Form_Builder_Controller.saveUpsertRecord(testAcc, testMap, false,'','', false);
    }

    @isTest
    public static void testGetRelatedData(){
        date today = date.today();
        S360_Form_Builder_Controller.getRelatedData('Id', 'Contact', 'DoNotCall = false');
    }

    @isTest
    public static void testDeleteRecords(){
        Contact deleteMe = new Contact();
        deleteMe.LastName = 'what';
        deleteMe.HasOptedOutOfEmail	 = false;
        insert deleteMe;

        S360_Form_Builder_Controller.deleteRecords('Contact', deleteMe.Id);
        S360_Form_Builder_Controller.deleteRecords('StaticResource', deleteMe.Id);
    }
}