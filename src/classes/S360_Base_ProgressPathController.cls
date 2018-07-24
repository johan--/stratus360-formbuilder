public class S360_Base_ProgressPathController {
	@AuraEnabled
    public static SObject checkFieldValue(String fieldName, Id parentId, String primaryObject){
        SObject acc = ((database.query('SELECT '+fieldName+' FROM '+primaryObject+' WHERE Id=:parentId'))[0]);
        return acc;
    }
}