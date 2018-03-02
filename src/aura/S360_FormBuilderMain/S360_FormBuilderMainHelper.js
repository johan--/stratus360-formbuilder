({
	getUrlParam: function(sParam){
        var params = decodeURIComponent(window.location.search.substring(1));
        params = params.split('&');
        for(var i = 0; i < params.length; i++){
            var targetParam = params[i].split('=');
            if(targetParam[0] === sParam){
                return targetParam[1]; 
            }
        }
    },
    
    upsert: function(component, sender){
        // validate captcha
        if(component.get('v.isCaptchaEnabled') && !component.get('v.isCaptchaSuccess')){
            alert('Please complete the Captcha');
            return;
        }
        var self = this;
        var child;
        
        if(component.get('v.componentType') === 'Standard'){
            child = component.find('S360_FormBuilderStandard');
        }else{
            child = component.find('S360_FormBuilderCustom');
        }
        try{
            var action = component.get('c.saveUpsertRecord');
            action.setParams({
                "data" : component.get('v.Data'),
                "relatedData" : component.get('v.RelatedData')
            });
            action.setCallback(this, function(response){
                if(component.isValid() && response.getState() == 'SUCCESS'){
                    if(response.getReturnValue().status == true){
                    	child.afterSubmit(sender, 'SUCCESS', 'Operation Success');    
                    }else{
                        child.afterSubmit(sender, 'ERROR', response.getReturnValue().message);
                    }
                    
                }else if(response.getState() == 'INCOMPLETE'){
            		child.afterSubmit(sender, 'ERROR', 'You might be offline');
                }
                
                console.log('finish');
            });
            $A.enqueueAction(action);
        }catch(e){
            child.afterSubmit(sender, 'ERROR', 'You might be offline');
        }
    },
    
    populateData : function(formConfig, data){
        var item = {
            'sobjectType': formConfig.S360_FA__Primary_Object__c,
            'Id': (data != undefined && data['Id']) ? data['Id'] : undefined,
            'Name': (data != undefined && data['Name']) ? data['Name'] : undefined,
        };
        if(formConfig.S360_FA__Field__c){
            formConfig.S360_FA__Field__c.split(',').forEach(function(field){
                if(data != undefined && data[field]){
                    item[field] = data[field];
                }else{
                    item[field] = '';
                }
                
            });    
        }
        
        return item;
    }
})