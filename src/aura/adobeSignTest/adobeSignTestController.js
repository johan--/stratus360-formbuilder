({
    init : function(component, event, helper) {
        var context = new AdobeSignSdk.Context();
        
        //Initialize the Widget API        
        var widgetsApi = new AdobeSignSdk.WidgetsApi(context);        
        var agreementsModel = AdobeSignSdk.AgreementsModel;   
        var context = new AdobeSignSdk.Context();
        var transientDocumentsApi = new AdobeSignSdk.TransientDocumentsApi(context);
        debugger;
        var action = component.get("c.adobeAuth");
        var url = "https://secure.echosign.com/public/oauth?redirect_uri=https://login.salesforce.com&response_type=code&client_id=CBJCHBCAABAA4mypzUJ5XMdxlLXvug7h3a2Zfpu9nmsh&scope=user_login:self+agreement_send:account"
        action.setParams({"url" : url});
        action.setCallback(this, function(response) {
            debugger;
            var state = response.getState();
            if (state === "SUCCESS") {
                var res = response.getReturnValue();
                console.log(res);
            } else {
                var error = (response.getError());
                for(var i in error){
                    console.log(i + error[i]);
                }
            }
        });
        $A.enqueueAction(action);
        /*
        //Get the Widget model        
        var widgetsModel = AdobeSignSdk.WidgetsModel;        
        
        //Populate the access token
        var headerParams = {"accessToken": "3AAANOTTHEREALTOKENbGQm9WNai"};        
        
        //Start creating the widget
        var widgetCreationInfo = new widgetsModel.WidgetCreationInfo();
        
        //Set the document ID
        var fileInfo = new widgetsModel.WidgetFileInfo();
        fileInfo.setTransientDocumentId("3AAljRNOTTHEREALID9GoAOxiK");        
        
        var fileInfoList = [];        
        fileInfoList.push(fileInfo);       
        
        //Populate the widget creation details
        widgetCreationInfo.setName("MyAgreement");        
        widgetCreationInfo.setFileInfos(fileInfoList);
        widgetCreationInfo.setSignatureFlow("SENDER_SIGNATURE_NOT_REQUIRED");        
        
        var widgetCreationRequest = new widgetsModel.WidgetCreationRequest();        
        widgetCreationRequest.setWidgetCreationInfo(widgetCreationInfo);        
        
        widgetsApi.createWidget(headerParams, widgetCreationRequest)                
        .then(function (widgetCreationResponse) {                    
            console.log(widgetCreationResponse.getWidgetId());                
        })               
        .catch(function (apiError) {                   
            console.log(apiError);               
        });*/ 
    },
    
    publish : function(component, event, helper) {
        var action = component.get("c.platform");
        action.setCallback(this, function(response) {
        });
        $A.enqueueAction(action);
    }
})