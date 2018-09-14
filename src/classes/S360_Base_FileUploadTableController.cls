public with sharing class S360_Base_FileUploadTableController {
    @AuraEnabled
    public static Map<String, Object> getObjectAttachment(String filterCondition, decimal pOffset, decimal pSize, String sortDirection, String orderBy, String ReportId, String FormId){
        List <S360_FA__S360_Form_Config__c> primary = [SELECT S360_FA__Primary_Object__c from S360_FA__S360_Form_Config__c where Id = :FormId];
        System.debug(primary[0]);
        String objwanted = primary[0].S360_FA__Primary_Object__c;
        System.debug(objwanted);
        String query = 'Select Id From '+objwanted+ ' Limit 10';
		List<SObject> objL = Database.query(query);
        
        Map<String, Boolean> objectPermission = S360_Base_ObjectCommon.getObjectPermission(objL[0].id.getSObjectType().getDescribe());
        Map<String, Object> data = new Map<String, Object>();
        
        //expenseReportPermission.put('isCreateable', false);
        
        if(objectPermission.get('isAccessible')){
            integer pageOffset = (integer)pOffset;
            integer pageSize = (integer)pSize;
            String whereCondition = '';
            
            if(filterCondition != ''){
                whereCondition = 'where ('+filterCondition+')';
            }
            
            System.debug(whereCondition);
            
            integer count = 0;
            try{
                AggregateResult results = database.query('SELECT COUNT(id) result FROM Attachment ' + whereCondition);
                count = Integer.valueOf(results.get('result'));    
                
                System.debug('Count ' + count);
            }catch(System.QueryException qe){
                List<String> msg = new List<String>();
                msg.add(qe.getMessage());
                System.debug('COunt failed ' + msg);
                return S360_Base_ServerResult.returnMessage(false, msg);
            }
            
            List<ObjectWrapper> objectWrappers = new List<ObjectWrapper>();
            Map<String, Object> result = getExpenseHelper(filterCondition, pageSize, pageOffset, orderBy, sortDirection);
            System.debug(result);
            if(Boolean.valueOf(result.get('status'))){
                for(Attachment e : (List<Attachment>)result.get('data')){
                    ObjectWrapper ew = new ObjectWrapper();
                    ew.selected = false;
                    ew.objects = e;
                    
                    objectWrappers.add(ew);
                }
                
                data.put('ObjectPermission', objectPermission);
                data.put('length', count);
                data.put('objectWrapper', objectWrappers);
                
                return S360_Base_ServerResult.returnMessage(true, null, data);
            }else{
                data.put('ObjectPermission', objectPermission);
                result.put('data', data);
                
                return result;
            }
        }else{
            data.put('ObjectPermission', objectPermission);
            return S360_Base_ServerResult.returnMessage(true, null, data);
        }
        
        
    }
    
     /**
     * Inner class to wrap up an SObject Label and its Id
     */
    public class ObjectWrapper
    {
        @AuraEnabled
        public Attachment objects {set; get;}
        
        @AuraEnabled
        public Boolean selected {set; get;}
    }
    
    public static Map<String, Object> getExpenseHelper(String filterCondition, Integer l, Integer o, String sortBy, String sortDirection){
        String whereCondition = '';
        integer mo = 2000;
        if(Test.isRunningTest()){
            mo = 500;
        }
        
        string sql = '';
        ID id = null;
        string tmpSortByValue = '';
        String operator = '';
        if(sortDirection == 'asc'){
            operator = '>';
        }else{
            operator = '<';
        }
        
        boolean isFieldInteger = false;
        
        Map<String, Schema.SObjectField> M = Schema.SObjectType.Attachment.fields.getMap();
        Schema.SObjectField field = M.get(sortBy);
        if(field != null){
            Schema.DisplayType FldType = field.getDescribe().getType();
        
            if(FldType == Schema.DisplayType.CURRENCY || FldType == Schema.DisplayType.DOUBLE || FldType == Schema.DisplayType.INTEGER 
               || FldType == Schema.DisplayType.PERCENT || FldType == Schema.DisplayType.DATE || FldType == Schema.DisplayType.DATETIME){
                isFieldInteger = true;
            }
        }
        
        List<Attachment> ls = new List<Attachment>();
        List<Attachment> tmpLs = new List<Attachment>();
    
        if(o <= mo){
            if(filterCondition != ''){
                whereCondition = 'where ('+filterCondition+')';
            }
            
            sql = 'select Id, Name '+
                +' from Attachment '+ whereCondition +' order by '+sortBy+' '+sortDirection+' nulls last, Id '+sortDirection+' limit '+l+' offset '+o;
            
            try{
             	List<Attachment> exp = Database.query(sql);
                System.debug(exp);
                return S360_Base_ServerResult.returnMessage(true, null, exp);
            }catch(System.QueryException qe){
                List<String> msg = new List<String>();
                msg.add(qe.getMessage());
                return S360_Base_ServerResult.returnMessage(false, msg);
            }
        }else{
            integer iterateCount = (integer)Math.floor(o / mo);
            
            for(integer i = 0; i < iterateCount; i++){
                if(id != null){
                    if(filterCondition != ''){
                        whereCondition = '('+filterCondition+') and';
                    }
                    
                    sql = 'select Id, Name '+
                        +' from Attachment where '+ whereCondition + tmpSortByValue +' order '
                        +'by '+sortBy+' '+sortDirection+' nulls last, Id '+sortDirection+' limit '+mo;
                }else{
                    if(filterCondition != ''){
                        whereCondition = 'where ('+filterCondition+')';
                    }

                    sql = 'select Id, Name '+
                        +' from Attachment '+ whereCondition +' order by '+sortBy+' '+sortDirection+' nulls last, Id '+sortDirection+' limit '+mo;
                }
                
                try{
                    tmpLs = Database.query(sql);
                }catch(System.QueryException qe){
                    List<String> msg = new List<String>();
                    msg.add(qe.getMessage());
                    return S360_Base_ServerResult.returnMessage(false, msg);
                }
               
                try{
				System.debug(tmpLs);
                    if(tmpLs.get(tmpLs.size()-1).get(sortBy) != null){
                        Object fieldValue = tmpLs.get(tmpLs.size()-1).get(sortBy);
                        
                        if(isFieldInteger){
                            tmpSortByValue = ' (('+sortBy+' '+operator+' '+fieldValue+') '
                                +'or ('+sortBy+' = '+fieldValue+' and Id '+operator+' :id)) ';
                        }else{
                            tmpSortByValue = ' (('+sortBy+' '+operator+' \''+fieldValue+'\') '
                                +'or ('+sortBy+' = \''+fieldValue+'\' and Id '+operator+' :id)) ';
                        }   
                    }else{
                        tmpSortByValue = ' (Id '+operator+' :id) ';
                    }
                }catch(SObjectException eee){
                    tmpSortByValue = ' (Id '+operator+' :id) ';
                }finally{
                    
                }
                
                id = tmpLs.get(tmpLs.size()-1).Id;
            }
            
            if(filterCondition != ''){
                whereCondition = '('+filterCondition+') and';
            }
            
            if(Math.mod(o, mo) == 0){
                sql = 'select Id, Name '+
                    +' from Attachment where '+ whereCondition + tmpSortByValue + ' order '
                    +'by '+sortBy+' '+sortDirection+' nulls last, Id '+sortDirection+' limit '+l;
            }else{
                sql = 'select Id, Name '+
                    +' from Attachment where '+ whereCondition + tmpSortByValue + ' order '
                    +'by '+sortBy+' '+sortDirection+' nulls last, Id '+sortDirection+' limit '+l+' offset ' + Math.mod(o, mo);
            }
            
            try{
             	ls = Database.query(sql);
                return S360_Base_ServerResult.returnMessage(true, null, ls);
            }catch(System.QueryException qe){
                List<String> msg = new List<String>();
                msg.add(qe.getMessage());
                return S360_Base_ServerResult.returnMessage(false, msg);
            }
        }
    }
    
    @AuraEnabled
    public static Id saveTheChunk(Id parentId, String fileName, String base64Data, String contentType, String fileId) { 
        if (fileId == '') {
            fileId = S360_Base_FileUploadController.saveTheFile(parentId, fileName, base64Data, contentType);
        } else {
            S360_Base_FileUploadController.appendToFile(fileId, base64Data);
        }
        system.debug('fileId:'+fileId);
        return Id.valueOf(fileId);
    }
    
    @AuraEnabled
    public static Map<String, Object> deleteAttachment(String attachmentId){
        try{
        	List<Attachment> attachments = [select Id from Attachment where Id = :attachmentId];
            delete attachments;
            
            return S360_Base_ServerResult.returnMessage(true, null);
        }catch(DmlException dmle){
            List<String> msg = new List<String>();
            msg.add(dmle.getMessage());
            return S360_Base_ServerResult.returnMessage(false, msg);
        }
    }
    
    @AuraEnabled
    public static void linkFile2parent(string parentid, string cvid){
        S360_Base_FileUploadController.linkFile2parent(parentid, cvid);
    }
    
    /**
     * Inner class to wrap up an SObject Label and its Id
     */
    public class FilesWrapper
    {
        @AuraEnabled
        public ContentVersion objects {set; get;}
        
        @AuraEnabled
        public Boolean selected {set; get;}
    }
    
    @AuraEnabled
    public static Map<String, Object> getFiles(String filterCondition, decimal pOffset, decimal pSize, String sortDirection, String orderBy, String parentId, String formId){
        List <S360_FA__S360_Form_Config__c> primary = [SELECT S360_FA__Primary_Object__c from S360_FA__S360_Form_Config__c where Id = :formId];
        
        String objwanted = primary[0].S360_FA__Primary_Object__c;
		objwanted = objwanted.toLowerCase();
		
		Map<String, Boolean> objectPermission = new Map<String, Boolean>();
		
		Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
		for(string sk : gd.keySet()){
			if(sk.toLowerCase() == objwanted){
				objectPermission.put('isAccessible', gd.get(sk).getDescribe().isAccessible());
				objectPermission.put('isCreateable', gd.get(sk).getDescribe().isCreateable());
				objectPermission.put('isUpdateable', gd.get(sk).getDescribe().isUpdateable());
				objectPermission.put('isDeletable', gd.get(sk).getDescribe().isDeletable());
				break;
			}
		}
        Map<String, Object> data = new Map<String, Object>();
        
        
        if(objectPermission.get('isAccessible')){
            integer pageOffset = (integer)pOffset;
            integer pageSize = (integer)pSize;
            String whereCondition = '';
            
            if(filterCondition != ''){
                whereCondition = 'where ('+filterCondition+')';
            }
            
            System.debug(whereCondition);
            
			String contentDocumentIds = '';
            integer count = 0;
            try{
				List<ContentDocumentLink> links = database.query('SELECT ContentDocumentId FROM ContentDocumentLink ' + whereCondition);
				count = links.size();
				
				for(ContentDocumentLink cdl : links){
					contentDocumentIds += '\'' + cdl.ContentDocumentId + '\',';
				}
                
                contentDocumentIds = contentDocumentIds.removeEnd(',');
				
            }catch(System.QueryException qe){
                data.put('ObjectPermission', objectPermission);
                
                List<String> msg = new List<String>();
                msg.add(qe.getMessage());
                System.debug('Count failed ' + msg);
                
                return S360_Base_ServerResult.returnMessage(false, msg, data);
            }
            
            List<FilesWrapper> objectWrappers = new List<FilesWrapper>();
            Map<String, Object> result = getFilesHelper(pageSize, pageOffset, orderBy, sortDirection, contentDocumentIds);
            
            if(Boolean.valueOf(result.get('status'))){
                for(ContentVersion e : (List<ContentVersion>)result.get('data')){
                    FilesWrapper ew = new FilesWrapper();
                    ew.selected = false;
                    ew.objects = e;
                    
                    objectWrappers.add(ew);
                }
                
                data.put('ObjectPermission', objectPermission);
                data.put('length', count);
                data.put('objectWrapper', objectWrappers);
                
                return S360_Base_ServerResult.returnMessage(true, null, data);
            }else{
                data.put('ObjectPermission', objectPermission);
                result.put('data', data);
                
                return result;
            }
        }else{
            data.put('ObjectPermission', objectPermission);
            return S360_Base_ServerResult.returnMessage(true, null, data);
        }
    }
    
    
    public static Map<String, Object> getFilesHelper(Integer l, Integer o, String sortBy, String sortDirection, string contentDocumentIds){
        String whereCondition = '';
        
        integer mo = 2000;
        if(Test.isRunningTest()){
            mo = 500;
        }
        
        string sql = '';
        ID id = null;
        string tmpSortByValue = '';
        String operator = '';
        if(sortDirection == 'asc'){
            operator = '>';
        }else{
            operator = '<';
        }
        
        boolean isFieldInteger = false;
        
        Map<String, Schema.SObjectField> M = Schema.SObjectType.ContentVersion.fields.getMap();
        Schema.SObjectField field = M.get(sortBy);
        if(field != null){
            Schema.DisplayType FldType = field.getDescribe().getType();
        
            if(FldType == Schema.DisplayType.CURRENCY || FldType == Schema.DisplayType.DOUBLE || FldType == Schema.DisplayType.INTEGER 
               || FldType == Schema.DisplayType.PERCENT || FldType == Schema.DisplayType.DATE || FldType == Schema.DisplayType.DATETIME){
                isFieldInteger = true;
            }
        }
        
        List<ContentVersion> ls = new List<ContentVersion>();
        List<ContentVersion> tmpLs = new List<ContentVersion>();
    
        if(o <= mo){
            if(contentDocumentIds != null){
                whereCondition = ' where ContentDocumentId in ('+ contentDocumentIds +') and IsLatest = true ';
            }
            
            sql = 'select ContentDocumentId, Title '+
                +' from ContentVersion '+ whereCondition +' order by '+sortBy+' '+sortDirection+' nulls last, Id '+sortDirection+' limit '+l+' offset '+o;
            
            try{
             	List<ContentVersion> exp = Database.query(sql);
                return S360_Base_ServerResult.returnMessage(true, null, exp);
            }catch(System.QueryException qe){
                List<String> msg = new List<String>();
                msg.add(qe.getMessage());
                return S360_Base_ServerResult.returnMessage(false, msg);
            }
        }else{
            integer iterateCount = (integer)Math.floor(o / mo);
            
            for(integer i = 0; i < iterateCount; i++){
                if(id != null){
                    if(contentDocumentIds != null && contentDocumentIds != ''){
                        whereCondition = '(ContentDocumentId in ('+ contentDocumentIds +') and IsLatest = true ) and ';
                    }
                    
                    sql = 'select ContentDocumentId, Title '+
                        +' from ContentVersion where '+ whereCondition + tmpSortByValue +' order '
                        +'by '+sortBy+' '+sortDirection+' nulls last, Id '+sortDirection+' limit '+mo;
                }else{
                    if(contentDocumentIds != null && contentDocumentIds != ''){
                        whereCondition = 'where (ContentDocumentId in ('+ contentDocumentIds +') and IsLatest = true )';
                    }

                    sql = 'select ContentDocumentId, Title '+
                        +' from ContentVersion '+ whereCondition +' order by '+sortBy+' '+sortDirection+' nulls last, Id '+sortDirection+' limit '+mo;
                }
                
                try{
                    tmpLs = Database.query(sql);
                }catch(System.QueryException qe){
                    List<String> msg = new List<String>();
                    msg.add(qe.getMessage());
                    return S360_Base_ServerResult.returnMessage(false, msg);
                }
               
                try{
				System.debug(tmpLs);
                    if(tmpLs.get(tmpLs.size()-1).get(sortBy) != null){
                        Object fieldValue = tmpLs.get(tmpLs.size()-1).get(sortBy);
                        
                        if(isFieldInteger){
                            tmpSortByValue = ' (('+sortBy+' '+operator+' '+fieldValue+') '
                                +'or ('+sortBy+' = '+fieldValue+' and Id '+operator+' :id)) ';
                        }else{
                            tmpSortByValue = ' (('+sortBy+' '+operator+' \''+fieldValue+'\') '
                                +'or ('+sortBy+' = \''+fieldValue+'\' and Id '+operator+' :id)) ';
                        }   
                    }else{
                        tmpSortByValue = ' (Id '+operator+' :id) ';
                    }
                }catch(SObjectException eee){
                    tmpSortByValue = ' (Id '+operator+' :id) ';
                }finally{
                    
                }
                
                id = tmpLs.get(tmpLs.size()-1).Id;
            }
            
            if(contentDocumentIds != null && contentDocumentIds != ''){
                whereCondition = '(ContentDocumentId in ('+ contentDocumentIds +') and IsLatest = true ) and';
            }
            
            if(Math.mod(o, mo) == 0){
                sql = 'select ContentDocumentId, Title '+
                    +' from ContentVersion where '+ whereCondition + tmpSortByValue + ' order '
                    +'by '+sortBy+' '+sortDirection+' nulls last, Id '+sortDirection+' limit '+l;
            }else{
                sql = 'select ContentDocumentId, Title '+
                    +' from ContentVersion where '+ whereCondition + tmpSortByValue + ' order '
                    +'by '+sortBy+' '+sortDirection+' nulls last, Id '+sortDirection+' limit '+l+' offset ' + Math.mod(o, mo);
            }
            
            try{
             	ls = Database.query(sql);
                return S360_Base_ServerResult.returnMessage(true, null, ls);
            }catch(System.QueryException qe){
                List<String> msg = new List<String>();
                msg.add(qe.getMessage());
                return S360_Base_ServerResult.returnMessage(false, msg);
            }
        }
    }
    
    @AuraEnabled
    public static Map<String, Object> deleteFile(String docId){
        try{
        	List<ContentDocument> doc = [select Id from ContentDocument where Id = :docId];
            delete doc;
            
            return S360_Base_ServerResult.returnMessage(true, null);
        }catch(DmlException dmle){
            List<String> msg = new List<String>();
            msg.add(dmle.getMessage());
            return S360_Base_ServerResult.returnMessage(false, msg);
        }
    }
    
}