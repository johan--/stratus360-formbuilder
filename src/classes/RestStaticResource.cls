@RestResource(urlMapping='/RestStaticResource/*')
global with sharing class RestStaticResource {
	@HttpGet
	global static String doGet() {
        RestRequest req = RestContext.request;
        
        string resourceName = req.params.get('name');
        string resourcePath = '';
        if(req.params.get('path') != null){
            resourcePath = req.params.get('path');
        }
        
        StaticResource[] static_resource = [SELECT Name, Id, SystemModStamp FROM StaticResource WHERE Name = :resourceName LIMIT 1];
		
        if(static_resource.size() > 0){
         	String url_file_ref = '/resource/'
                    + String.valueOf(((DateTime)static_resource[0].get('SystemModStamp')).getTime())
                    + '/' 
                    + static_resource[0].get('Name') + '/' + resourcePath;   
            PageReference file_ref = new PageReference(url_file_ref);
			return file_ref.getContent().toString();
        }else{
            return '';
        }
        
        //return req.requestURI;
    }
}