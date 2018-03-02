@isTest
public class S360_Base_ServerResult_Test {
    @isTest
    public static void testReturnMessage(){
        Boolean testStatus = true;
        List<String> test = new List<String>();
        Object testObject;

        S360_Base_ServerResult.returnMessage(testStatus, test);
        S360_Base_ServerResult.returnMessage(testStatus, test, testObject);

    }
}