public with sharing class LookupSObjectController
{
    
    /**
     * Aura enabled method to search a specified SObject for a specific string
     */
    @AuraEnabled
    public static Result[] lookup(String searchString, String sObjectAPIName, String whereClause, String whereClauseType , String whereClauseValue, String displayField )
    {
		System.debug('search string = ' + searchString);

        // Sanitze the input
        String sanitizedSearchString = String.escapeSingleQuotes(searchString);
        String sanitizedSObjectAPIName = String.escapeSingleQuotes(sObjectAPIName);
        String sanitizeWhereClause = '';
        String sanitizedDisplayField = '';

        List<String> listDisplayField = new List<String>();


        //
        if(whereClause != ''){

            if(whereClauseValue != ''){
                
            	String[] listWhereClause = whereClause.split(',');
            	String[] listWhereClauseType = whereClauseType.split(',');
            	String[] listWhereClauseValue = whereClauseValue.split(',');
            
            
            	sanitizeWhereClause = ' WHERE ' + buildWhereClause(listWhereClause,listWhereClauseType,listWhereClauseValue);    
            }
            
        }
        if(displayField != ''){
            sanitizedDisplayField = String.escapeSingleQuotes(displayField);
            listDisplayField = sanitizedDisplayField.split(',');
            sanitizedDisplayField = ', ' + sanitizedDisplayField;

        }


        List<Result> results = new List<Result>();

        // Build our SOSL query
        String searchQuery = 'FIND \'' + sanitizedSearchString + '*\' IN ALL FIELDS RETURNING ' + sanitizedSObjectAPIName + ' (id,name '+ sanitizedDisplayField + sanitizeWhereClause +' ORDER BY Name) Limit 50'; 

        system.debug('SEARCH QUERY : ' + searchQuery);

        // Execute the Query
        List<List<SObject>> searchList = search.query(searchQuery);

        // Create a list of matches to return
        for (SObject so : searchList[0])
        {

            //results.add(new Result((String)so.get('Name') + buildDisplayField(so,listDisplayField), so.Id));
            results.add(new Result((String)so.get('Name') + buildDisplayField(so,listDisplayField), so.Id, so));
        }
        
        System.debug('RESULT ' + results);
        return results;
    }

    public static String buildDisplayField(SObject so, List<String> listDisplayField){
        String results = '';

        String stringConcatFields = '';

        Integer i = 0;
        for(String str:listDisplayField){
            if(str != ''){
                if ((String)so.get(str) != null)
                {
                    stringConcatFields = stringConcatFields + ' - ' + (String)so.get(str);
                }
            }
            
        }

        return stringConcatFields;
    }

    public static String buildWhereClause(List<String> whereClause, List<String> whereClauseType, List<String> whereClauseValue){
        String results = '';

        String singleWhereClause = '';

        Integer i = 0;
        for(String str:whereClause){
            if(whereClauseType[i]=='String'){
                singleWhereClause = String.escapeSingleQuotes(str) + '\'' + String.escapeSingleQuotes(whereClauseValue[i]) + '\'';
            }
            if(results == ''){
                results = singleWhereClause;
            }
            else{
                results = results + ' AND ' +  singleWhereClause;
            }
        }



        return results;
    }

    /**
     * Inner class to wrap up an SObject Label and its Id
     */
    public class Result
    {
        @AuraEnabled public String SObjectLabel {get; set;}
        @AuraEnabled public Id SObjectId {get; set;}
        @AuraEnabled public SObject result {get; set;}
        
        public Result(String sObjectLabel, Id sObjectId)
        {
            this.SObjectLabel = sObjectLabel;
            this.SObjectId = sObjectId;
        }
        
        public Result(String sObjectLabel, Id sObjectId, SObject result)
        {
            this.SObjectLabel = sObjectLabel;
            this.SObjectId = sObjectId;
            this.result = result;
        }
    }
}