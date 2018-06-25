public class S360_Base_ProgressPathController {
	@AuraEnabled
    public static Account checkFieldValue(String fieldName, Id parentId, String primaryObject){
        Account acc = (Account)((database.query('SELECT '+fieldName+' FROM '+primaryObject+' WHERE Id=:parentId'))[0]);
        return acc;
    }
}