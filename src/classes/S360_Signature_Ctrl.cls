public class S360_Signature_Ctrl {
    /*@AuraEnabled
    public static String uploadSignature(String demoReportId, String b64SignData){
        try {
            //update the att flag
            ///Demo_Report__c dr = [SELECT Id, Is_Signed__c, Demo__r.Name FROM Demo_Report__c WHERE Id =: demoReportId];
            ///dr.Is_Signed__c = true;
            ///update dr;
            
            // insert cv
            ContentVersion cvToInsert = new ContentVersion();
            cvToInsert.versionData = EncodingUtil.base64Decode(b64SignData);
            //String fileName = 'Sig_'+UserInfo.getFirstName()+'_'+UserInfo.getLastName()+'_'+String.valueOf(Date.today()).substring(0,10);
            ///String fileName = 'Sig_'+dr.Demo__r.Name+'_'+String.valueOf(Date.today()).substring(0,10);
            String fileName = 'Sig__'+String.valueOf(Date.today()).substring(0,10);
            
            cvToInsert.title = fileName;
            cvToInsert.pathOnClient = '/'+fileName+'.png';
            insert cvToInsert;
            
            system.debug('@@@contentversion record before select: ' + cvToInsert);
            
            string conDocId = [SELECT Id from ContentDocument WHERE LatestPublishedVersionId =: cvToInsert.id].Id;
            
            system.debug('@@@contentversion record after select: ' + cvToInsert);
            
            // Insert Content Document Link
            ContentDocumentLink cdl = new ContentDocumentLink();
            cdl.ContentDocumentId = conDocId;
            cdl.LinkedEntityId = demoReportId;
            cdl.ShareType = 'V';
            cdl.Visibility = 'AllUsers';
            system.debug('@@@contentdocumentlink record: ' + cdl);
            insert cdl;
            
            return '';
        } catch (Exception e){
            String errorMessage = e.getMessage();
            Integer occurence;
            if (e.getMessage().contains('FIELD_CUSTOM_VALIDATION_EXCEPTION')){
                occurence = errorMessage.indexOf('FIELD_CUSTOM_VALIDATION_EXCEPTION,') + 34;
                errorMessage = errorMessage.mid(occurence, errorMessage.length());
                occurence = errorMessage.lastIndexOf(':');
                errorMessage = errorMessage.mid(0, occurence);
            }
            system.debug('Error: '+e);
            system.debug('Error: '+errorMessage);
            return errorMessage;
        }
    }*/
    
    
    @AuraEnabled
    public static String upsertSignature(String CompId, String parentId, String b64SignData){
        try {
            //String fileName = 'Sig__' + String.valueOf(System.now()) + '__' + parentId;
            String fileName = 'Sig__' + CompId + '__' + parentId;
            
            //get content document link
           	List<ContentDocumentLink> lcdl = [select ContentDocumentId from ContentDocumentLink where LinkedEntityId = :parentId];
            if(lcdl.size() > 0){
            	// insert cv
                ContentVersion cvToInsert = new ContentVersion();
                cvToInsert.ContentDocumentId = lcdl[0].ContentDocumentId;
                cvToInsert.versionData = EncodingUtil.base64Decode(b64SignData);
                cvToInsert.title = fileName;
                cvToInsert.pathOnClient = '/'+fileName+'.png';
                insert cvToInsert;
            }else{
                // insert cv
                ContentVersion cvToInsert = new ContentVersion();
                cvToInsert.versionData = EncodingUtil.base64Decode(b64SignData);
                cvToInsert.title = fileName;
                cvToInsert.pathOnClient = '/'+fileName+'.png';
                insert cvToInsert;    
                
                string conDocId = [SELECT Id from ContentDocument WHERE LatestPublishedVersionId =: cvToInsert.id].Id;
                
                // Insert Content Document Link
                ContentDocumentLink cdl = new ContentDocumentLink();
                cdl.ContentDocumentId = conDocId;
                cdl.LinkedEntityId = parentId;
                cdl.ShareType = 'V';
                cdl.Visibility = 'AllUsers';
                
                insert cdl;
            }
            
            return '';
        } catch (Exception e){
            String errorMessage = e.getMessage();
            Integer occurence;
            if (e.getMessage().contains('FIELD_CUSTOM_VALIDATION_EXCEPTION')){
                occurence = errorMessage.indexOf('FIELD_CUSTOM_VALIDATION_EXCEPTION,') + 34;
                errorMessage = errorMessage.mid(occurence, errorMessage.length());
                occurence = errorMessage.lastIndexOf(':');
                errorMessage = errorMessage.mid(0, occurence);
            }
            system.debug('Error: '+e);
            system.debug('Error: '+errorMessage);
            return errorMessage;
        }
    }
    
    @AuraEnabled
    public static String getSignature(string CompId, string parentId){
        String fileName = 'Sig__' + CompId + '__' + parentId;
        List<ContentDocumentLink> lcdl = [select Id, ContentDocumentId, LinkedEntityId from ContentDocumentLink where LinkedEntityId = :parentId];
        if(lcdl.size() > 0){
            List<ContentVersion> cv = [select Id, title, pathOnClient, versionData from ContentVersion where title = :fileName and ContentDocumentId = :lcdl[0].ContentDocumentId and IsLatest = true limit 1];
            if(cv.size() > 0){
             	return EncodingUtil.base64Encode(cv[0].VersionData);   
            }
        }
        
        return '';
    }
}