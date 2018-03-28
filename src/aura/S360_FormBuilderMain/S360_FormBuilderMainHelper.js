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
        var self = this;
        var child;
        
        if(component.get('v.componentType') === 'Standard'){
            child = component.find('S360_FormBuilderStandard');
        }else{
            child = component.find('S360_FormBuilderCustom');
        }
        try{
            var isSignatureEnabled = component.get('v.isSignatureEnabled');
            var canvasDataUrl;
            
            if(isSignatureEnabled){
             	canvasDataUrl = self.getExactSignatureDataUrl(component.get('v.canvas'));
                if(!canvasDataUrl){
                    isSignatureEnabled = false;
                }
                canvasDataUrl = canvasDataUrl.replace(/^data:image\/(png|jpg);base64,/, "");   
            }
            
            var action = component.get('c.saveUpsertRecord');
            action.setParams({
                "data" : component.get('v.Data'),
                "relatedData" : component.get('v.RelatedData'),
                "isSignatureEnabled": isSignatureEnabled,
                "signatureData": canvasDataUrl
            });
            action.setCallback(this, function(response){
                
                if(component.isValid() && response.getState() == 'SUCCESS'){
                    if(response.getReturnValue().status == true){
                        // refresh the data
                        component.set('v.Data', response.getReturnValue().data);
                    	child.afterSubmit(sender, 'SUCCESS', $A.get("$Label.c.S360_base_default_success_message"));    
                    }else{
                        child.afterSubmit(sender, 'ERROR', response.getReturnValue().message);
                    }
                    
                }else if(response.getState() == 'INCOMPLETE'){
            		child.afterSubmit(sender, 'INCOMPLETE', $A.get("$Label.c.S360_base_offline_message"));
                }
            });
            $A.enqueueAction(action);
        }catch(e){
            child.afterSubmit(sender, 'ERROR', $A.get("$Label.c.S360_base_offline_message"));
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
                
                // if type refference
                if(data != undefined && data.hasOwnProperty(field.substr(0, field.lastIndexOf("__c")) + '__r')){
                    field = field.substr(0, field.lastIndexOf("__c")) + '__r';
                    if(data != undefined && data[field]){
                        item[field] = data[field];
                    }else{
                        item[field] = '';
                    }
                }
                
            });    
        }
        
        return item;
    },
    
    getExactSignatureDataUrl: function(canvas){
        var ctx = canvas.getContext('2d');
        
        var w = canvas.width,
            h = canvas.height,
            pix = {x:[], y:[]},
            imageData = ctx.getImageData(0,0,canvas.width,canvas.height),
            x, y, index;
        
        for (y = 0; y < h; y++) {
            for (x = 0; x < w; x++) {
                index = (y * w + x) * 4;
                if (imageData.data[index+3] > 0) {
                    
                    pix.x.push(x);
                    pix.y.push(y);
                    
                }   
            }
        }
        pix.x.sort(function(a,b){return a-b});
        pix.y.sort(function(a,b){return a-b});
        var n = pix.x.length-1;
        
        w = pix.x[n] - pix.x[0];
        h = pix.y[n] - pix.y[0];
        var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);
        
        
        var hl = document.createElement('canvas');
        hl.width = w;
        hl.height = h;
        
        hl.getContext('2d').putImageData(cut, 0,0);
        
        return hl.toDataURL();
    }
})