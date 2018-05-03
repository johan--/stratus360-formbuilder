public class S360_Form_Builder_Controller {
    @AuraEnabled
    /**
     * recordId could be S360_Form_Config__c id or Other id (object to preview)
     * recordId act as S360_Form_Config__c id when we run it on form config wizard preview
     * recordId act as (object to preview) when we run it outsite the form config wizard preview
     */
    public static Map<String, Object> getComponentConfig(String formName, String recordId){
        String formId = ''; // S360_Form_Config__c id
        String dataId = ''; // object to preview id
        
        System.debug(recordId);
        
        //Language
        String strLanguage = Label.Language;
        
        if(recordId != null && recordId != ''){
            ID targetId = ID.valueOf(recordId);
            
            // check is target id is S360_Form_Config__c id
            // if yes, the recordId is S360_Form_Config__c
            // else recordId id is owned by object to preview
            if(targetId.getSobjectType() == Schema.S360_FA__S360_Form_Config__c.SObjectType){
                formId = targetId;
            }else{
                dataId = targetId;
            }
        }
        
        Map<String, Object> serverResponse = new Map<String, Object>();
        List<S360_FA__S360_Form_Config__c> formConfigs;
        
        if(formName != null && formName != '')
        {	
            
            formConfigs = [select S360_FA__JSON__c, S360_FA__Primary_Object__c, S360_FA__Field__c, S360_FA__Component_Type__c, S360_FA__Custom_Css__c, S360_FA__Custom_Script__c, S360_FA__Input_Flow_Map__c from S360_FA__S360_Form_Config__c where name = :formName AND S360_FA__Language__c = :strLanguage limit 1];
        	
        }else
        {
            formConfigs = [select S360_FA__JSON__c, S360_FA__Primary_Object__c, S360_FA__Field__c, S360_FA__Component_Type__c, S360_FA__Custom_Css__c, S360_FA__Custom_Script__c, S360_FA__Input_Flow_Map__c from S360_FA__S360_Form_Config__c where id = :formId AND S360_FA__Language__c = :strLanguage limit 1];
        }
        
        //Just in case language was not selected, get the blank language.
        if(formConfigs.size()==0){
			formConfigs = [select S360_FA__JSON__c, S360_FA__Primary_Object__c, S360_FA__Field__c, S360_FA__Component_Type__c, S360_FA__Custom_Css__c, S360_FA__Custom_Script__c, S360_FA__Input_Flow_Map__c from S360_FA__S360_Form_Config__c where id = :formId limit 1];
        }
        
        // initialize server response
        serverResponse.put('message', '');
        serverResponse.put('status', true);
        serverResponse.put('data', null);
        serverResponse.put('fieldInfo', null);
        serverResponse.put('formConfig', null);
        
        if(formConfigs.size() == 0){
            serverResponse.put('status', false);
            serverResponse.put('message', Label.FormNotFound);
            return serverResponse;
        }else{
            // replace config json__c with attachemnt value
            // our new version use attachment to save json config to avoid json string overflow
            //Attachment[] tmp = [select id, Name, Body, ParentId from Attachment where ParentId = :formConfigs[0].Id];
            Attachment[] tmp = [select id, Name, Body, ParentId from Attachment where  Name = :('form_' + formConfigs[0].Id)];
            
            if(tmp.size() > 0){
            	if(tmp[0].Body != null){
                    formConfigs[0].S360_FA__JSON__c = tmp[0].Body.toString();    
                }    
            }
            
            
            S360_FA__S360_Form_Config__c config = formConfigs[0];
            
            serverResponse.put('formConfig', config);
            
            if(config.S360_FA__Primary_Object__c != null){
                Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe(); 
                //if(globalDescribe.get(config.Primary_Object__c.toLowerCase()) != null){
                    Schema.DescribeSObjectResult objectDescribe = globalDescribe.get(config.S360_FA__Primary_Object__c.toLowerCase()).getDescribe();
                    
                    // check is user has access permission to this object
                    if(!objectDescribe.isAccessible()){
                        serverResponse.put('status', false);
                        serverResponse.put('message', Label.ObjectNotAccessible);
                        return serverResponse;
                    }
                    
                    // if dataId is empty check is user has creatable permission
                    if(dataId == ''){
                        if(!objectDescribe.isCreateable()){
                            serverResponse.put('status', false);
                            serverResponse.put('message', Label.ObjectNotCreatable );
                            return serverResponse;
                        }   
                    }
                    // if not check is user has updateable permission
                    else if(!objectDescribe.isUpdateable()){
                        serverResponse.put('status', false);
                        serverResponse.put('message', Label.ObjectNotUpdatable );
                        return serverResponse;
                    }
                    
                    //Get all fields exist in Object
                    Map<String, FieldInformation> fieldInformations = new Map<String, FieldInformation>();
                    Map<String, Schema.SobjectField> fieldInfo = objectDescribe.fields.getMap();
                    
                    // get field description
                    for(Schema.SobjectField f: fieldInfo.values()){
                        DescribeFieldResult dfr = f.getDescribe();
                        
                        fieldInformations.put(dfr.getName(), new FieldInformation(
                            dfr.getLabel(),
                            dfr.getInlineHelpText(),
                            dfr.isAccessible(),
                            dfr.isCreateable(),
                            dfr.isUpdateable(),
                            dfr.isUnique(),
                            dfr.getRelationshipName()
                        ));
                    }
                    serverResponse.put('fieldInfo', fieldInformations);                
                    
                    // get record data
                    String strRealFields = '';
                    if(config.S360_FA__Field__c == null || config.S360_FA__Field__c == ''){
                        strRealFields = 'Name';
                    }else{
                        strRealFields = config.Field__c;
                    }
                    
                    // generate field which refference
                    for(String name : fieldInformations.keySet()){
                        if(fieldInformations.get(name).relationshipApi != null && fieldInformations.get(name).relationshipApi != ''){
                            strRealFields += ', ' + fieldInformations.get(name).relationshipApi + '.Name';
                        }
                    }
                    
                    String sql = 'SELECT ' + strRealFields + '  FROM ' + config.S360_FA__Primary_Object__c + ' WHERE Id = \'' + dataId +'\'';
                    
                    List<SObject> data = Database.query(sql);
                    
                    if(data.size() > 0){
                        serverResponse.put('data', data[0]);    
                    }
                    
                    serverResponse.put('status', true);
                    
                    return serverResponse;
                /*}else{
                    serverResponse.put('status', false);
                    serverResponse.put('message', Label.ObjectNotFound);
                    return serverResponse;
                }*/
            }
            
        }
        
        return serverResponse;
    }
    
    @AuraEnabled
    public static Map<String, Object> saveUpsertRecord(sobject data, Map<String, List<object>> relatedData, boolean isSignatureEnabled, string signatureData){
        System.debug(data);
        System.debug(relatedData);
        System.debug(isSignatureEnabled);
        System.debug(signatureData);
        
        Map<String, Object> serverResponse = new Map<String, Object>();
        try{
            upsert data;
            
            Id parentId = data.Id;
            
            if(relatedData != null)
            {

                // construct and save related data
                for(string key : relatedData.keySet()){
                    
                    // get the field name that reference to parent
                    string relatedField = key.split('\\|')[1];
                    List<object> records = (List<object>)relatedData.get(key);
                    
                    List<SObject> childRecords;
                    if(records.size() > 0){
                        Map<object, object> tmpRe = (Map<object, object>)records[0];
                    	String listType = 'List<' + (string)tmpRe.get('sobjectType') + '>';
            			childRecords = (List<SObject>)Type.forName(listType).newInstance();  
                    }
                    System.debug('rec is = ' + records);
                    //List<Sobject> childRecords = new List<Sobject>();
                    
                    for(object re : records){
                        Map<object, object> tmpRe = (Map<object, object>)re;
                        sObject sObj = Schema.getGlobalDescribe().get((string)tmpRe.get('sobjectType')).newSObject() ;
                        sObj.put(relatedField, parentId);
                        for(object fname : tmpRe.keySet()){
                            System.debug((string)fname);
                            if((string)fname != 'sobjectType')
                            	sObj.put((string)fname, tmpRe.get((string)fname));
                        }
                        childRecords.add(sObj);
                    }
                    
                    if(childRecords != null && !childRecords.isEmpty()){
                     	upsert childRecords;   
                    }
                }
            }
            
            // upsert signature data
            if(isSignatureEnabled){
                String res = S360_Signature_Ctrl.upsertSignature(data.Id, signatureData);
                System.debug(res);
                if(res != ''){
            		serverResponse.put('status', false);
            		serverResponse.put('data', data);        
                    serverResponse.put('message', res);
                    
                    return serverResponse;
                }
            }
            
            serverResponse.put('status', true);
            serverResponse.put('data', data);
        }catch(DMLException e){
            serverResponse.put('status', false);
            serverResponse.put('message', e.getMessage());
        }
        
        return serverResponse;
    }
    
    @AuraEnabled
    public static List<sobject> getRelatedData(String fields, String sFrom, String cWhere){
        list<sobject> serverResponse = new list<sobject>();
        String swhere = '';
        if(cWhere != null && cWhere != ''){
            swhere = ' where ' + cWhere;
        }
        
        String query = 'select ' + fields + ' from ' + sFrom + swhere;
        serverResponse = Database.query(query);
        
        return serverResponse;
    }
    
    @AuraEnabled
    public static Map<String, Object> deleteRecords(String obj, string lid){
        Map<String, Object> serverResponse = new Map<String, Object>();
        try{
            List<Sobject> lobj = database.query('select Id from ' + obj + ' where Id in ('+ lid +') ');
            delete lobj;
            
            serverResponse.put('status', true);
        }catch(QueryException qe){
            serverResponse.put('status', false);
            serverResponse.put('message', qe.getMessage());
        }catch(DMLException dmle){
            serverResponse.put('status', false);
            serverResponse.put('message', dmle.getMessage());
        }
        
        return serverResponse;
    }
    
    class FieldInformation {
        @AuraEnabled public String label {get; set;}
        @AuraEnabled public String helpText {get; set;}
        @AuraEnabled public Boolean isAccessible {get; set;}
        @AuraEnabled public Boolean isCreateable {get; set;}
        @AuraEnabled public Boolean isUpdateable {get; set;}
        @AuraEnabled public Boolean isUnique {get; set;}
        @AuraEnabled public String relationshipApi {get; set;}
        
        public FieldInformation(String label, String helpText, boolean isAccessible, boolean isCreateable, boolean isUpdateable, boolean isUnique){
            this.label = label;
            this.helpText = helpText;
            this.isAccessible = isAccessible;
            this.isCreateable = isCreateable;
            this.isUpdateable = isUpdateable;
            this.isUnique = isUnique;
        }
        
        public FieldInformation(String label, String helpText, boolean isAccessible, boolean isCreateable, boolean isUpdateable, boolean isUnique, String relationshipApi){
            this.label = label;
            this.helpText = helpText;
            this.isAccessible = isAccessible;
            this.isCreateable = isCreateable;
            this.isUpdateable = isUpdateable;
            this.isUnique = isUnique;
            this.relationshipApi = relationshipApi;
        }
    }
}