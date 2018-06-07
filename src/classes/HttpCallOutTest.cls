public with sharing class HttpCallOutTest {
    
    // Pass in the endpoint to be used using the string url
    @AuraEnabled
    public static String adobeAuth(String url) {
        
        // Instantiate a new http object
        Http h = new Http();
        
        // Instantiate a new HTTP request, specify the method (GET) as well as the endpoint
        HttpRequest req = new HttpRequest();
        req.setEndpoint(url);
        req.setMethod('GET');
        
        // Send the request, and return a response
        HttpResponse res = h.send(req);
        return res.getBody();
    }
    
    @AuraEnabled
    public static void platform() {
        S360_FA__Test_Event__e test = new S360_FA__Test_Event__e(S360_FA__Name__c = 'Test');
        EventBus.publish(test);
    }
}