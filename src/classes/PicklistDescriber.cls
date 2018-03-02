/*
Copyright (c) 2012 tgerm.com
All rights reserved.
Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. The name of the author may not be used to endorse or promote products
   derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*
    Class which client code needs to interact with. Call any of the overloaded describe method,
    make sure you are passing all the params in the method signature
*/
public with sharing class PicklistDescriber {
    static final Pattern OPTION_PATTERN = Pattern.compile('<option.+?>(.+?)</option>');

    /*
        Desribe a picklist field for an sobject id. RecordType is automatically picked
        based on the record's RecordTypeId field value.
        example usage :
        List<String> options = PicklistDescriber.describe(accountId, 'Industry');
    */
    @AuraEnabled
    public static List<String> describeID(Id sobjectId, String pickListFieldAPIName) {
        return parseOptions(
                            new Map<String, String> {
                                                     'id' => sobjectId,
                                                     'pickListFieldName'=> pickListFieldAPIName
                                                    }
                            );
    }

    /*
        Describe a picklist field for a SobjectType, its given record type developer name and the picklist field
        example usage :
        List<String> options = PicklistDescriber.describe('Account', 'Record_Type_1', 'Industry'));
    */
    @AuraEnabled
    public static Map<String,List<String>> describe(String sobjectType, String recordTypeName, List<String> pickListFieldAPINames) {

        Map<String,List<String>> resultPicklist = new  Map<String,List<String>>();

        for(String picklistName:pickListFieldAPINames)
        {
            List<String> resultList = parseOptions(
                        new Map<String, String> {
                                                 'sobjectType' => sobjectType,
                                                 'recordTypeName' => recordTypeName,
                                                 'pickListFieldName'=> picklistName
                                                }
                        );
            String key = recordTypeName + picklistName;
            resultPicklist.put(key,resultList);
        }





        return resultPicklist;
    }

    @AuraEnabled
    public static Map<String,List<String>> describeAll(String sobjectType, List<String>pickListFieldAPINames){

        Map<String,List<String>> resultPicklist = new  Map<String,List<String>>();

        //Get describe for SObject
        Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
        Schema.SObjectType ctype = gd.get(sobjectType);
        Map<String, Schema.SobjectField> fmap = ctype.getDescribe().fields.getMap();

        system.debug('MAP ' + fmap);
        system.debug('Fields ' + pickListFieldAPINames);
        for(String picklistName:pickListFieldAPINames)
        {
            List<String> resultList = new List<String>();

            Schema.DescribeFieldResult fieldResult = fmap.get(picklistName).getDescribe();
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
            for( Schema.PicklistEntry f : ple){
                resultList.add(f.getLabel() + '|' + f.getValue());

            }


            String key = picklistName;
            resultPicklist.put(key,resultList);
        }
		
        System.debug('resultPicklist');
        System.debug(resultPicklist);
        return resultPicklist;

    }

    /*
        Describe a picklist field for a SobjectType, its given record type ID and the picklist field
        example usage :
        Id recType1Id = [Select Id from RecordType Where SobjectType = 'Account'
                                            AND DeveloperName like 'Record_Type_2'].Id;
        System.assertEquals(REC_TYPE_1_OPTIONS, PicklistDescriber.describe('Account', recType2Id, 'Industry'));
    */
    /* Not Used
    public static List<String> describe(String sobjectType, Id recordTypeId, String pickListFieldAPIName) {
        return parseOptions(
                            new Map<String, String> {
                                                     'sobjectType' => sobjectType,
                                                     'recordTypeId' => recordTypeId,
                                                     'pickListFieldName'=> pickListFieldAPIName
                                                    }
                            );
    }
    */

    /*
        Internal method to parse the OPTIONS
    */
    static List<String> parseOptions(Map<String, String> params) {
        Set<String> allOption = new Set<String>();

        Pagereference pr = Page.PicklistDesc;
        // to handle development mode, if ON
        pr.getParameters().put('core.apexpages.devmode.url', '1');



        List<String> paramKeySet  = new List<string>(params.keySet());

        system.debug(' PARAM ' + paramKeySet );

        for (String key : paramKeySet ) {
            system.debug(' key ' + key);
            system.debug(' param ' + params.get(key));
            pr.getParameters().put(key, params.get(key));
        }


        String xmlContent = '';

        if(Test.isRunningTest())
        {
            xmlContent = '';
        }
        else
        {
            system.debug(' PR ' + pr);
            xmlContent = pr.getContent().toString();
        }

        system.debug('XML Content '  + xmlContent);

        Matcher mchr = OPTION_PATTERN.matcher(xmlContent);
        List<String> options = new List<String>();
        while(mchr.find()) {

            String s = mchr.group(1);
            s = s.replace('&lt;','<').replace('&gt;','>').replace('&amp;','&').replace('&#39;','\'');

            if(allOption.contains(s))
            {

            }
            else
            {
                allOption.add(s);

                options.add(s);
            }

        }
        // remove the --None-- element
        if (!options.isEmpty() && options[0].contains('None')) options.remove(0);
        return options;
    }
}