public class ApexExtractorGenerator {
    final static String endpoint = 'https://NA54.salesforce.com/services/data/v38.0/tooling/sobjects';
    
    public static boolean generateExtractor(string objectName) {
        
        string extractorName = objectName.toLowerCase() + '4Extractor';
        
        List<ApexClass> classes = [select id from ApexClass where Name = :extractorName];
        if(classes.size() > 0){
            return true;
        }else{
            // create a Http request with post method
            HttpRequest req = createHttpRequest(endpoint+'/ApexClass','POST');
            req.setBody( '{"Name":"'+extractorName+'","Body":"public class '+extractorName+' {@InvocableMethod(label=\''+extractorName+'\')public static List<'+objectName+'> extract'+objectName+'(List<string> datas) '+
                        +'{List<'+objectName+'> result = new List<'+objectName+'>();if(datas.size() > 0){if(datas[0] != \'\'){Map<String, Object> data = (Map<String, Object>)JSON.deserializeUntyped(datas[0]);'+
                        objectName + ' s = ('+ objectName +')Type.forName(\''+ objectName +'\').newInstance();for(string field : data.keySet())'+
                        '{if(field != \'sobjectType\'){s.put(field, data.get(field));}}result.add(s);}}return result;}}"}');
            
            String response = getResponse(req);
            System.debug(response);
            
            return true;
        }
    }
    
    // create a http request with required endpoint and request method
    private static HttpRequest createHttpRequest(String endpoint, String method){
        HttpRequest req = new HttpRequest();
        endpoint += '';
        req.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionID());
        req.setHeader('Content-Type', 'application/json');
        req.setEndpoint(endpoint);
        req.setMethod(method);
        return req;
    }
    
    // used receive response by sending a http request
    private static String getResponse(HttpRequest req){
        try
        {
            Http httpreq = new Http();
            HttpResponse res = httpreq.send(req);
            String reqresponse = res.getBody();
            return reqresponse;
        }
        catch (Exception e)
        {
            return 'Error:' +e.getMessage();
        }
    }
}