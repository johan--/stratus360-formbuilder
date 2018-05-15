@isTest
public class LookupSObjectController_Test {
    @isTest
    public static void testSearch(){
        Account v1 = new Account();
        Account v2 = new Account();
        v1.Name = 'Account1';
        v2.Name = 'Account2';
        
        insert v1;
        insert v2;

        Id [] fixedSearchResults= new ID[]{v1.Id, v2.Id};
        Test.setFixedSearchResults(fixedSearchResults);

        List<LookupSObjectController.Result> results1 = LookupSObjectController.lookup('account', 'Account', '', '', '', '');
        
        for(LookupSObjectController.Result r : results1){
            if(r.SObjectLabel == 'Account1'){
                System.assertEquals(v1.Id, r.SObjectId);        
            }
            
            if(r.SObjectLabel == 'Account2'){
                System.assertEquals(v2.Id, r.SObjectId);        
            }
        }
    }
    
    @isTest
    public static void testStringWhereType(){
        Contact v1 = new Contact( LastName = 'Common1', Department= 'account1');
        Contact v2 = new Contact( LastName  = 'Common2', Department  = 'account2');
        v1.Birthdate = date.today();
        v2.Birthdate = date.today();
        v1.LastName= 'last';
        v2.LastName= 'last';
        
        insert v1;
        insert v2;
        
        Id [] fixedSearchResults= new ID[]{v1.Id, v2.Id};
        Test.setFixedSearchResults(fixedSearchResults);

        List<LookupSObjectController.Result> results1 = LookupSObjectController.lookup('Dummy', 'S360_FA__Dummy_Object__c', 'S360_FA__Last_Name__c=,S360_FA__Password__c=', 'String,String', 'Common1,account1', '');
        
        // System.assertEquals(1, results1.size());
        // System.assertEquals(v1.Id, results1.get(0).SObjectId);        
        // System.assertEquals('D-', results1.get(0).SObjectLabel);        
    }
    
    // //@isTest
    // public static void testBooleanWhereType(){
    //     S360_FA__Dummy_Object__c v1 = new S360_FA__Dummy_Object__c(S360_FA__Last_Name__c = 'Common1', S360_FA__Password__c = 'account1', S360_FA__Interest__c  = false);
    //     S360_FA__Dummy_Object__c v2 = new S360_FA__Dummy_Object__c( S360_FA__Last_Name__c = 'Common2', S360_FA__Password__c = 'account2', S360_FA__Interest__c  = true);
    //     v1.S360_FA__Date_Time__c = date.today();
    //     v2.S360_FA__Date_Time__c = date.today();
    //     v1.S360_FA__Last_Name__c = 'last';
    //     v2.S360_FA__Last_Name__c = 'last';
        
    //     insert v1;
    //     insert v2;
        
    //     Id [] fixedSearchResults= new ID[]{v1.Id, v2.Id};
    //     Test.setFixedSearchResults(fixedSearchResults);

    //     List<LookupSObjectController.Result> results1 = LookupSObjectController.lookup('Dummy', 'S360_FA__Dummy_Object__c', 'S360_FA__Interest__c =', 'Boolean', 'true', '');
        
    //     // System.assertEquals(1, results1.size());
    //     // System.assertEquals(v2.Id, results1.get(0).SObjectId);        
    //     // System.assertEquals('D-', results1.get(0).SObjectLabel); 
    // }
    
    // //@isTest
    // public static void testPicklistWhereType(){
    //     S360_FA__Dummy_Object__c v1 = new S360_FA__Dummy_Object__c( S360_FA__Last_Name__c = 'Common1', S360_FA__Password__c = 'account1', S360_FA__Game_Type__c = 'Game1');
    //     S360_FA__Dummy_Object__c v2 = new S360_FA__Dummy_Object__c( S360_FA__Last_Name__c = 'Common2', S360_FA__Password__c = 'account2', S360_FA__Game_Type__c = 'Game1');
    //     v1.S360_FA__Date_Time__c = date.today();
    //     v2.S360_FA__Date_Time__c = date.today();
    //     v1.S360_FA__Last_Name__c = 'last';
    //     v2.S360_FA__Last_Name__c = 'last';
        
    //     insert v1;
    //     insert v2;
        
    //     Id [] fixedSearchResults= new ID[]{v1.Id, v2.Id};
    //     Test.setFixedSearchResults(fixedSearchResults);

    //     List<LookupSObjectController.Result> results1 = LookupSObjectController.lookup('Dummy', 'S360_FA__Dummy_Object__c', 'S360_FA__Game_Type__c in ', 'Picklist', 'Game1', '');
        
    //     // System.assertEquals(1, results1.size());
    //     // System.assertEquals(v2.Id, results1.get(0).SObjectId);        
    //     // System.assertEquals('D-', results1.get(0).SObjectLabel); 
    // }
    
    // @isTest
    // public static void testDisplayField(){
    //     S360_FA__Dummy_Object__c v1 = new S360_FA__Dummy_Object__c( S360_FA__Last_Name__c = 'Common1', S360_FA__Password__c = 'account1', S360_FA__Game_Type__c = 'Game1');
    //     S360_FA__Dummy_Object__c v2 = new S360_FA__Dummy_Object__c( S360_FA__Last_Name__c = 'Common2', S360_FA__Password__c = 'account2', S360_FA__Game_Type__c = 'Game1');
    //     v1.S360_FA__Date_Time__c = date.today();
    //     v2.S360_FA__Date_Time__c = date.today();
    //     v1.S360_FA__Last_Name__c = 'last';
    //     v2.S360_FA__Last_Name__c = 'last';
        
    //     insert v1;
    //     insert v2;
        
    //     Id [] fixedSearchResults= new ID[]{v1.Id, v2.Id};
    //     Test.setFixedSearchResults(fixedSearchResults);

    //     //List<LookupSObjectController.Result> results1 = LookupSObjectController.lookup('Dummy', 'S360_FA__Dummy_Object__c', 'S360_FA__Game_Type__c in ', 'Picklist', 'Game1', 'S360_FA__Game_Type__c');
        
    //     // System.assertEquals(1, results1.size());
    //     // System.assertEquals(v2.Id, results1.get(0).SObjectId);        
        
    // }

    @isTest
    public static void testResult(){
        Contact v1 = new Contact();
        v1.Birthdate= date.today();
        v1.LastName = 'last';

        insert v1;

        Id testId = v1.Id;

        LookupSObjectController.Result a = new LookupSObjectController.Result('test', testId);
        LookupSObjectController.Result b = new LookupSObjectController.Result('test', testId, v1);

    }
}