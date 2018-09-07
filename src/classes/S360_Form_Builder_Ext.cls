global with sharing class S360_Form_Builder_Ext {
    
    //public List<String> objectFields {get; private set;}
    public String[] otherAttach {get; set;}
    public String otherAttachJSON {get; set;}
    public string objectFields {get; private set;}
    public String jsonConfig {get; set;}
    public String language {get; set;}
    public String[] langList{get; set;}
    public String langListJS{get; set;}
    public String selectedLanguage {get; set;}
    public String frAttach {get; set;}
    public Integer selectedVersion {get;set;}
    public Boolean hasFlowController {get; set;}
    //public List<SelectOption> addLangs {get; private set;}
    /*public String printAttachmentId {get; set;}
public String printAttachmentName {get; set;}
public Attachment printAttachment {
get {
if (printAttachment == null)
printAttachment = new Attachment();
return printAttachment;
}
set;
}*/
    
    public S360_FA__S360_Form_Config__c formConfig {get; private set;}
    public List<SelectOption> versionList {get; private set;}
    public List<SelectOption> languageList {get; private set;}
    private Attachment jsonAttachment;
    private Attachment jsonAttachmentFR;
    private Integer versionField;
    private Attachment frAttachment;
    private Map<String, Attachment> otherAttachment;
    private Attachment[] frAttaches;
    private Map<String, Attachment[]> otherAttaches;
    public String thisurl {get; private set;}
    public String thisID {get; private set;}
    
    public S360_Form_Builder_Ext(ApexPages.StandardController stdCtrl){
        langListJS ='';
        langList =  new List<String>();
        otherAttach = new List<String>();
        List<String> availableFields = new List<String>();
        formConfig = (S360_FA__S360_Form_Config__c)stdCtrl.getRecord();
        thisID = ApexPages.currentPage().getParameters().get('id');
        System.debug(formConfig);
        System.debug(stdCtrl);
        thisurl = System.URL.getSalesforceBaseUrl().toExternalForm();
        System.debug(thisurl);
        selectedVersion = Integer.valueOf([SELECT S360_FA__SelectedVersion__c from S360_FA__S360_Form_Config__c where id =:formConfig.Id][0].S360_FA__SelectedVersion__c);
        System.debug(selectedVersion);
        language = [SELECT S360_FA__Language__c from S360_FA__S360_Form_Config__c where id =:formConfig.Id][0].S360_FA__Language__c ;
        selectedLanguage = [SELECT S360_FA__Language__c from S360_FA__S360_Form_Config__c where id =:formConfig.Id][0].S360_FA__Language__c ;
        List<S360_FA__S360_Form_Config__c> versionConfig = [SELECT 	S360_FA__Version_No__c from S360_FA__S360_Form_Config__c where id =:formConfig.Id];
        versionField = Integer.valueOf(versionConfig[0].S360_FA__Version_No__c);
        otherAttaches = new Map<String, Attachment[]>();
        
        otherAttachment= new Map<String, Attachment>();
        // List<String> langsAll = new String[]{'Chinese (Simplified):','Chinese (Traditional):zh_TW','Danish:da','Dutch:nl_NL','English:en_US','Finnish:fi','French:fr','German:de','Italian:it','Japanese:ja','Korean:ko','Norwegian:no','Portuguese (Brazil):pt_BR','Russian:ru','Spanish:es','Spanish (Mexico):es_MX','Swedish:sv','Thai:th'};
        // for(Integer i = 0; i < langsAll.size(); i++){
        //   String[] tempLang = langsAll[i].split(':')''
        //   addLangs.add(new SelectOption(tempLang[1], tempLang[0]));
        // }
        
        Schema.DescribeFieldResult fieldResult = S360_FA__S360_Form_Config__c.S360_FA__Language__c.getDescribe();
        List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();
        languageList = new List<SelectOption>();
        for (Schema.PicklistEntry entry : picklistEntries){
            if(entry.getValue() !='en'){
                langListJS += entry.getValue()+',';
                langList.add(entry.getValue().replace(' ', ''));
            }
            languageList.add(new SelectOption(entry.getValue(),entry.getLabel()));
        }
        System.debug(langList);
        // languageList = new List<SelectOption>();
        // languageList.add(new SelectOption('en', 'English'));
        // languageList.add(new SelectOption('fr', 'French'));
        
        updateTimeStamps();
        System.debug([SELECT S360_FA__Version_No__c from S360_FA__S360_Form_Config__c where id =:formConfig.Id]);
        // get primary object field list
        if(formConfig != null && formConfig.Primary_Object__c != null){
            String primaryObject = formConfig.Primary_Object__c;
            Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe();
            if(globalDescribe.get(primaryObject.toLowerCase()) != null){
                Schema.DescribeSObjectResult objectDescribe = globalDescribe.get(primaryObject.toLowerCase()).getDescribe();
                Map<String, Schema.SobjectField> fieldInfo = objectDescribe.fields.getMap();
                for(Schema.SobjectField f: fieldInfo.values()){
                    DescribeFieldResult dfr = f.getDescribe();
                    availableFields.add(dfr.getName());
                    if(dfr.getRelationshipName() !=null){
                        availableFields.add(dfr.getRelationshipName());
                    }
                }
            }
        }
        
        objectFields = '';
        try{
            objectFields=availableFields[0];
            for(Integer i = 0; i<availableFields.size(); i++){
                objectFields += ','+availableFields[i];
            }
        }catch(ListException e){
            System.debug(e);
        }
        
        // get json config data from attachment
        jsonConfig = '';
        // Attachment[] tmp = [select id, Name, Body, ParentId from Attachment where ParentId = :formConfig.Id];
        Attachment[] tmp;
        if(language == 'en'){
            tmp = [select id, Name, Body, ParentId from Attachment where Name = :('form_' + formConfig.Id + '_v'+ String.valueOf(selectedVersion).leftPad(3, '0'))];
            // frAttaches = [select id, Name, Body, ParentId from Attachment where Name = :('form_' + formConfig.Id + '_v' + String.valueOf(selectedVersion).leftPad(3, '0') + '_FR')];
            // if (frAttaches.size() > 0){
            //   frAttach = frAttaches[0].Body.toString();
            //   frAttachment = frAttaches[0];
            // }
            for(Schema.PicklistEntry entry : picklistEntries){
                if(entry.getValue()!= 'en'){
                    Attachment[] tempAttach = [select id, Name, Body, ParentId from Attachment where Name = :('form_' + formConfig.Id + '_v' + String.valueOf(selectedVersion).leftPad(3, '0') + '_' + entry.getValue().touppercase())];
                    otherAttaches.put(entry.getValue(), tempAttach);
                    if(tempAttach.size() > 0){
                        System.debug(tempAttach[0].Body.toString());
                        otherAttach.add(tempAttach[0].Body.toString());
                        otherAttachment.put(entry.getValue(), tempAttach[0]);
                    } else {
                        otherAttach.add('');
                        otherAttachment.put(entry.getValue(), null);
                    }
                }
            }
            System.debug(JSON.serialize(otherAttach));
            System.debug(otherAttach);
            otherAttachJSON =JSON.serialize(otherAttach);
            System.debug(otherAttaches);
        } else {
            if(language!= 'en'){
                tmp = [select id, Name, Body, ParentId from Attachment where Name = :('form_' + formConfig.Id + '_v' + String.valueOf(selectedVersion).leftPad(3, '0')+ '_' + language.touppercase())];
            } else {
                tmp = [select id, Name, Body, ParentId from Attachment where Name = :('form_' + formConfig.Id + '_v' + String.valueOf(selectedVersion).leftPad(3, '0'))];
            }
        }
        if(tmp.size() > 0){
            jsonAttachment = tmp[0];
            if(tmp[0].Body != null){
                jsonConfig = tmp[0].Body.toString();
            }
        }else{
            jsonAttachment = new Attachment();
            if(Schema.sObjectType.Attachment.fields.ParentId.isCreateable() || Schema.sObjectType.Attachment.fields.ParentId.isUpdateable()){
                jsonAttachment.ParentId = formConfig.Id;
            }
            
            if(Schema.sObjectType.Attachment.fields.Name.isCreateable() || Schema.sObjectType.Attachment.fields.Name.isUpdateable()){
                jsonAttachment.Name = 'form_' + formConfig.Id + '_v' + String.valueOf(selectedVersion).leftPad(3, '0');
            }
        }
        System.debug(jsonConfig);
        
        if(jsonConfig == null || jsonConfig == ''){
            S360_FA__S360_Form_Config__c tmpFormConfig = [select JSON__c from S360_FA__S360_Form_Config__c where Id = :formConfig.Id];
            if(tmpFormConfig.JSON__c == null){
                jsonConfig = '';
            }else{
                jsonConfig =  tmpFormConfig.JSON__c;
            }
        }
        System.debug(jsonConfig);
        // end of get json config data from attachment
        
    }
    
    public PageReference save(){
        // generate object extractor for the flow
        if(hasFlowController){
            ApexExtractorGenerator.generateExtractor(formConfig.S360_FA__Primary_Object__c);
        }
        
        System.debug(otherAttachJSON);
        List<String> updatedAttach;
        try{
            updatedAttach = otherAttachJSON.split('~~~');
        } catch(Exception error) {
            
        }
        System.debug(updatedAttach);
        System.debug('Start');
        System.debug(jsonAttachment);
        
        if(Schema.sObjectType.S360_FA__S360_Form_Config__c.isUpdateable()){
            update formConfig;
        }
        
        // upsert json config attachemnt
        // if(jsonAttachment.Id != null){
        //     if(Schema.sObjectType.Attachment.isUpdateable()){
        //         if(Schema.sObjectType.Attachment.fields.Body.isUpdateable()){
        //          	jsonAttachment.Body = blob.valueOf(jsonConfig);
        //         }
        // 		update jsonAttachment;
        //     }
        //     if(language == 'en'){
        //       Integer index1 = 0;
        //       for (String currLang : langList){
        //
        //         if(otherAttaches.get(currLang) != null ){
        //           if(otherAttaches.get(currLang).size() == 0){
        //             Attachment jsonAttachmentFR = new Attachment();
        //             jsonAttachmentFR.ParentId = formConfig.Id;
        //             jsonAttachmentFR.Body = blob.valueOf(updatedAttach[index1]);
        //             jsonAttachmentFR.Name = 'form_' + formConfig.Id + '_v' + String.valueOf(selectedVersion).leftPad(3, '0')+'_'+ currLang.touppercase();
        //             insert jsonAttachmentFR;
        //           } else {
        //               Attachment a = otherAttachment.get(langList[index1]);
        //               if(a != null){
        //                 a.Body = blob.valueOf(updatedAttach[index1]);
        //                 update a;
        //               }
        //             }
        //           }
        //           index1++;
        //         }
        //       }
        
        if(jsonAttachment.Id != null){
            if(Schema.sObjectType.Attachment.isUpdateable()){
                if(Schema.sObjectType.Attachment.fields.Body.isUpdateable()){
                    jsonAttachment.Body = blob.valueOf(jsonConfig);
                }
                update jsonAttachment;
            }
            if(language == 'en'){
                for (Integer i = 0; i < langList.size(); i++){
                    if(otherAttaches.get(langList.get(i)) != null ){
                        if(otherAttaches.get(langList.get(i)).size() == 0){
                            Attachment jsonAttachmentFR = new Attachment();
                            jsonAttachmentFR.ParentId = formConfig.Id;
                            jsonAttachmentFR.Body = blob.valueOf(updatedAttach[i]);
                            jsonAttachmentFR.Name = 'form_' + formConfig.Id + '_v' + String.valueOf(selectedVersion).leftPad(3, '0')+'_'+ langList[i].touppercase();
                            insert jsonAttachmentFR;
                        } else {
                            Attachment a = otherAttachment.get(langList[i]);
                            if(a != null){
                                a.Body = blob.valueOf(updatedAttach[i]);
                                update a;
                            }
                        }
                    }
                }
            }
        }else{
            System.debug('Save p2');
            if(Schema.sObjectType.Attachment.isCreateable()){
                if(Schema.sObjectType.Attachment.fields.Body.isCreateable()){
                    jsonAttachment.Body = blob.valueOf(jsonConfig);
                }
                System.debug(jsonAttachment);
                insert jsonAttachment;
            }
            
            if(language == 'en' && updatedAttach != null){
                for(Integer i = 0; i < updatedAttach.size(); i++){
                    Attachment jsonAttachmentFR = new Attachment();
                    jsonAttachmentFR.ParentId = formConfig.Id;
                    jsonAttachmentFR.Body = blob.valueOf(updatedAttach.get(i));
                    System.debug(jsonAttachmentFR);
                    System.debug(selectedVersion);
                    jsonAttachmentFR.Name = 'form_' + formConfig.Id + '_v' + String.valueOf(selectedVersion).leftPad(3, '0')+'_' + langList[i].touppercase();
                    insert jsonAttachmentFR;
                }
            }
        }
        
        updateTimeStamps();
        
        return null;
    }
    
    public PageReference saveAs(){
        List<String> updatedAttach;
        try{
            updatedAttach = otherAttachJSON.split('~~~');
        } catch(Exception error) {
            
        }
        
        if(Schema.sObjectType.S360_FA__S360_Form_Config__c.isUpdateable()){
            update formConfig;
        }
        
        
        // upsert json config attachemnt
        if(Schema.sObjectType.Attachment.fields.Id.isAccessible() || Schema.sObjectType.Attachment.fields.Id.isCreateable() || Schema.sObjectType.Attachment.fields.Id.isUpdateable()){
            jsonAttachment.Id = null;
        }
        
        if(Schema.sObjectType.Attachment.fields.Body.isUpdateable() || Schema.sObjectType.Attachment.fields.Body.isCreateable()){
            jsonAttachment.Body = blob.valueOf(jsonConfig);
        }
        if(Schema.sObjectType.Attachment.fields.Name.isUpdateable() || Schema.sObjectType.Attachment.fields.Name.isCreateable()){
            jsonAttachment.Name = 'form_' + formConfig.Id + '_v' + (String.valueOf(versionField+1).leftPad(3, '0'));
        }
        if(Schema.sObjectType.Attachment.isCreateable()){
            insert jsonAttachment;
        }
        for (Integer i = 0; i < langList.size(); i++){
            Attachment jsonAttachmentFrench = new Attachment();
            jsonAttachmentFrench.ParentId = jsonAttachment.ParentId;
            if(updatedAttach[i]!=null){
                jsonAttachmentFrench.Body = blob.valueOf(updatedAttach[i]);
            } else {
                jsonAttachmentFrench.Body = blob.valueOf('');
            }
            jsonAttachmentFrench.Name = 'form_' + formConfig.Id + '_v' + (String.valueOf(versionField+1).leftPad(3, '0')) + '_' +langList[i].touppercase();
            insert jsonAttachmentFrench;
        }
        List<S360_FA__S360_Form_Config__c> versionConfig = [SELECT S360_FA__Version_No__c from S360_FA__S360_Form_Config__c where id =:formConfig.Id];
        versionconfig[0].S360_FA__Version_No__c++;
        System.debug(versionconfig[0].S360_FA__Version_No__c);
        if(Schema.sObjectType.S360_FA__S360_Form_Config__c.isUpdateable()){
            update(versionconfig);
        }
        
        List<S360_FA__S360_Form_Config__c> versionUpsert = [SELECT S360_FA__SelectedVersion__c from S360_FA__S360_Form_Config__c where id =:formConfig.Id];
        
        if(Schema.sObjectType.S360_FA__S360_Form_Config__c.fields.S360_FA__SelectedVersion__c.isUpdateable()){
            versionUpsert[0].S360_FA__SelectedVersion__c = versionField+1;
        }
        
        if(Schema.sObjectType.S360_FA__S360_Form_Config__c.isUpdateable()){
            update(versionUpsert);
        }
        updateTimeStamps();
        PageReference acctPage = new ApexPages.StandardController(formConfig).view();
        acctPage.setRedirect(true);
        return acctPage;
        
    }
    
    public PageReference refreshPage() {
        List<S360_FA__S360_Form_Config__c> versionUpsert = [SELECT S360_FA__SelectedVersion__c, S360_FA__Language__c from S360_FA__S360_Form_Config__c where id =:formConfig.Id];
        if(Schema.sObjectType.S360_FA__S360_Form_Config__c.fields.S360_FA__SelectedVersion__c.isUpdateable()){
            versionUpsert[0].S360_FA__SelectedVersion__c = selectedVersion;
            System.debug(selectedLanguage );
            versionUpsert[0].S360_FA__Language__c = selectedLanguage;
        }
        
        if(Schema.sObjectType.S360_FA__S360_Form_Config__c.isUpdateable()){
            update(versionUpsert);
        }
        
        /*PageReference pageRef = new PageReference(ApexPages.currentPage().getUrl());
System.debug(ApexPages.currentPage().getUrl());
pageRef.setRedirect(true);
return null;*/
        
        PageReference acctPage = new ApexPages.StandardController(formConfig).view();
        acctPage.setRedirect(true);
        return acctPage;
    }
    
    public PageReference autoSave(){
        return save();
    }
    
    @RemoteAction
    public static String doUploadAttachment(String parentId, String attachmentBody, String attachmentName, String attachmentId) {
        if(attachmentBody != null) {
            Attachment att = getAttachment(attachmentId);
            String newBody = '';
            if(att.Body != null) {
                newBody = EncodingUtil.base64Encode(att.Body);
            }
            newBody += attachmentBody;
            att.Body = EncodingUtil.base64Decode(newBody);
            if(attachmentId == null) {
                System.debug(att.Body);
                System.debug(parentId);
                att.Name = attachmentName;
                att.parentId = parentId;
            }
            upsert att;
            return att.Id;
        } else {
            return 'Attachment Body was null';
        }
    }
    
    
    private static Attachment getAttachment(String attId) {
        list<Attachment> attachments = [SELECT Id, Body
                                        FROM Attachment
                                        WHERE Id =: attId];
        if(attachments.isEmpty()) {
            Attachment a = new Attachment();
            return a;
        } else {
            return attachments[0];
        }
    }
    
    private void updateTimeStamps(){
        if(formConfig != null && formConfig.Primary_Object__c != null){
            Attachment[] attachs = [select id, Name, LastModifiedDate from Attachment where ParentId=:formConfig.Id];
            System.debug(attachs);
            versionList = new List<SelectOption>();
            for(Integer i = 0; i <= versionField; i++){
                for(Integer j = 0; j < attachs.size();j++){
                    if(language == 'en' && 'form_' + formConfig.Id + '_v'+ String.valueOf(i).leftPad(3, '0') == attachs[j].Name){
                        versionList.add(new SelectOption(String.valueOf(i), String.valueOf(attachs[j].LastModifiedDate)));
                    } else if ('form_' + formConfig.Id + '_v'+ String.valueOf(i).leftPad(3, '0') + '_' + language.touppercase() == attachs[j].Name){
                        versionList.add(new SelectOption(String.valueOf(i),String.valueOf(attachs[j].LastModifiedDate)));
                    }
                }
            }
            if(versionList.size() == 0){
                versionList.add(new SelectOption(String.valueOf(0),'None'));
            }
        }
    }
    
    public void cloneForm(){
        S360_FA__S360_Form_Config__c clone = new S360_FA__S360_Form_Config__c();
        System.debug(clone);
        S360_FA__S360_Form_Config__c curr = [select S360_FA__Component_Type__c,S360_FA__AutoSave_Record__c, S360_FA__AutoSave_Record_Interval__c, S360_FA__Custom_Css__c, S360_FA__Custom_Script__c, S360_FA__Description__c, S360_FA__Flow_Returns_Data__c, S360_FA__Has_Flow_Controller__c, 	S360_FA__Input_Flow_Map__c, 	S360_FA__Language__c, S360_FA__Lock_Logic__c, 	S360_FA__Save_to_Storage__c, S360_FA__SelectedVersion__c, 	S360_FA__Version_No__c, 	S360_FA__Record_Type__c, S360_FA__Record_Type_Mapping__c, 	S360_FA__Returned_Flow_Field__c from S360_FA__S360_Form_Config__c where id=:formConfig.Id limit 1	];
        clone.Name = formConfig.Name+ '-Clone';
        clone.S360_FA__AutoSave__c = formconfig.S360_FA__AutoSave__c;
        clone.S360_FA__AutoSave_Interval__c = formconfig.S360_FA__AutoSave_Interval__c;
        clone.S360_FA__Has_Flow_Controller__c = formconfig.S360_FA__Has_Flow_Controller__c;
        clone.S360_FA__Primary_Object__c = formconfig.S360_FA__Primary_Object__c;
        clone.S360_FA__AutoSave_Record__c = curr.S360_FA__AutoSave_Record__c;
        clone.S360_FA__AutoSave_Record_Interval__c = curr.S360_FA__AutoSave_Record_Interval__c;
        clone.S360_FA__Custom_Css__c = curr.S360_FA__Custom_Css__c;
        clone.S360_FA__Custom_Script__c = curr.S360_FA__Custom_Script__c;
        clone.S360_FA__Description__c= curr.S360_FA__Description__c;
        clone.S360_FA__Flow_Returns_Data__c= curr.S360_FA__Flow_Returns_Data__c;
        clone.S360_FA__Has_Flow_Controller__c= curr.S360_FA__Has_Flow_Controller__c;
        clone.S360_FA__Input_Flow_Map__c= curr.S360_FA__Input_Flow_Map__c;
        clone.S360_FA__Language__c= curr.S360_FA__Language__c;
        clone.S360_FA__Lock_Logic__c= curr.S360_FA__Lock_Logic__c;
        clone.S360_FA__Save_to_Storage__c= curr.S360_FA__Save_to_Storage__c;
        clone.S360_FA__SelectedVersion__c= curr.S360_FA__SelectedVersion__c;
        clone.S360_FA__Version_No__c= curr.S360_FA__Version_No__c;
        clone.S360_FA__Record_Type__c= curr.S360_FA__Record_Type__c;
        clone.S360_FA__Record_Type_Mapping__c= curr.S360_FA__Record_Type_Mapping__c;
        clone.S360_FA__Returned_Flow_Field__c= curr.S360_FA__Returned_Flow_Field__c;
        clone.S360_FA__Component_Type__c= curr.S360_FA__Component_Type__c;
        
        
        
        System.debug(clone);
        insert clone;
        String cloneID = clone.id;
        System.debug(cloneID);
        Attachment[] attachs = [select id, Name, LastModifiedDate, Body from Attachment where ParentId=:formConfig.Id];
        Attachment[] attachsClone = new Attachment[]{};
            for(Integer i = 0; i < attachs.size(); i++){
                Attachment attachClone = new Attachment();
                attachClone.Name = attachs[i].Name.replace(formConfig.ID, cloneId);
                attachClone.ParentId = cloneID;
                attachClone.Body = attachs[i].Body;
                System.debug(attachClone);
                attachsClone.add(attachClone);
            }
        System.debug(attachsClone);
        insert attachsClone;
    }
    
}