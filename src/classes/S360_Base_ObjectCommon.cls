public class S360_Base_ObjectCommon {
    public static Map<String, Boolean> getObjectPermission(DescribeSObjectResult objectDescribe){
        Map<String, Boolean> permissions = new Map<String, Boolean>();
        permissions.put('isAccessible', objectDescribe.isAccessible());
        permissions.put('isCreateable', objectDescribe.isCreateable());
        permissions.put('isUpdateable', objectDescribe.isUpdateable());
        permissions.put('isDeletable', objectDescribe.isDeletable());
        
        return permissions;
    }
    
    public static Map<String,Map<String, Boolean>> getFLS(Map<String,Schema.SObjectField> fieldMaps){
        Map<String,Map<String, Boolean>> fls = new Map<String,Map<String, Boolean>>();
        for(String fieldToCheck : fieldMaps.keySet()){
            Map<String, Boolean> permissions = new Map<String, Boolean>();
            
            permissions.put('isAccessible', fieldMaps.get(fieldToCheck).getDescribe().isAccessible());
            permissions.put('isCreateable', fieldMaps.get(fieldToCheck).getDescribe().isCreateable());
            permissions.put('isUpdateable', fieldMaps.get(fieldToCheck).getDescribe().isUpdateable());
            
            fls.put(fieldMaps.get(fieldToCheck).getDescribe().getName(), permissions);
        }
        
        return fls;
    }
    
    public static Map<String, Boolean> get1ParentRefFLS(Schema.DescribeFieldResult field, String fieldApi){
        String refField = fieldApi.substringAfter('__r.');
        List<Schema.sObjectType> lsoRef = field.getReferenceTo();
        if(lsoRef.size() == 0){
            return null;
        }
        
        Schema.sObjectType soRef = lsoRef.get(0);
        Schema.DescribeFieldResult dfRef = soRef.getDescribe().fields.getMap().get(refField).getDescribe();
        
        Map<String, Boolean> permissions = new Map<String, Boolean>();
        permissions.put('isAccessible', dfRef.isAccessible());
        permissions.put('isCreateable', dfRef.isCreateable());
        permissions.put('isUpdateable', dfRef.isUpdateable());
        
        return permissions;
    }
    
    public static String convertIdTo15Digit(Object recordId){
        if(recordId != null){
            String tmpRecordId = String.valueOf(recordId);
            
            if(tmpRecordId.length() > 15){
                return tmpRecordId.substring(0, 15);
            }
            
            return tmpRecordId;   
        }else{
            return '';
        }
    }
}