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
    
    upsert: function(component, sender, callback){
        debugger;
        console.log('data to save');
        for(var i in component.get('v.Data')){
            if(component.get('v.Data').hasOwnProperty(i))
                console.log(i + '' +component.get('v.Data')[i]);
        }
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
            debugger;
            console.log("HERE");
            console.log(component.get('v.Data'));
            var data1 = component.get('v.Data');
            data1.RecordTypeId = component.get("v.FormConfig").S360_FA__Record_Type__c;
            debugger;
            action.setParams({               
                "data" : data1,
                "relatedData" : component.get('v.RelatedData'),
                "isSignatureEnabled": isSignatureEnabled,
                "signatureData": canvasDataUrl
            });
            action.setCallback(this, function(response){
                
                if(component.isValid() && response.getState() == 'SUCCESS'){
                    if(response.getReturnValue().status == true){
                        // refresh the data
                        // component.set('v.Data', response.getReturnValue().data);
                        child.afterSubmit(sender, 'SUCCESS', $A.get("$Label.c.S360_base_default_success_message"));
                        
                        if(callback != undefined){
                            callback(response.getReturnValue().data);
                        }
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
    /*recordTypeMap : function(component, formConfig,data){
        debugger;
        if(formConfig.S360_FA__Record_Type_Mapping__c && this.getUrlParam('id') && data.RecordTypeId){
            var map = JSON.parse(formConfig.S360_FA__Record_Type_Mapping__c);
            var id = data.RecordTypeId;
            var newForm =  map[id].Name;
            console.log(newForm);
            var url = window.location.href;
            var formname = this.getUrlParam('formname');
            debugger;
            url = url.replace(formname,newForm);
            debugger;
            window.location.replace(url);
        } else if (formConfig.S360_FA__Record_Type_Mapping__c && component.get('v.recordId') && data.RecordTypeId){
            debugger;
            var map = JSON.parse(formConfig.S360_FA__Record_Type_Mapping__c);
            var id = data.RecordTypeId;
            var newForm =  map[id].Name;
            return newForm;
         
        }
    },*/
    recordTypeMap : function(component, formConfig,data){
        if (formConfig.S360_FA__Record_Type_Mapping__c && (component.get('v.recordId') || this.getUrlParam('id')) && data.RecordTypeId){
            debugger;
            var map = JSON.parse(formConfig.S360_FA__Record_Type_Mapping__c);
            var id = data.RecordTypeId;
            var newForm =  map[id].Name;
            return newForm;
         
        }
    },
    populateData : function(component, formConfig, data){
        // convert the inputFlowMap to json data
        var inputFlowMap = {};
        if(formConfig.S360_FA__Input_Flow_Map__c){
            inputFlowMap = JSON.parse(formConfig.S360_FA__Input_Flow_Map__c);    
        }
        
        // convert string data from previous flow to json
        var inputFlowData = {};
        if(component.get('v.inputFlow')){
            inputFlowData = JSON.parse(component.get('v.inputFlow'));   
        }
        
        console.log('here');
        console.log(inputFlowData);
        console.log(inputFlowMap);
        debugger;
        
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
                    var nfield = field.substr(0, field.lastIndexOf("__c")) + '__r';
                    if(data != undefined && data[nfield]){
                        item[nfield] = data[nfield];
                    }else{
                        item[nfield] = '';
                    }
                }
                
                // if we have the data from flow, than use that data
                var refFieldFromPrevFlow = inputFlowMap[field];
                if(refFieldFromPrevFlow){
                    item[field] = refFieldFromPrevFlow ? inputFlowData[refFieldFromPrevFlow] ? inputFlowData[refFieldFromPrevFlow] : item[field] : item[field];
                    
                    // if our data is lookup
                    var lookupMappingField = refFieldFromPrevFlow.substr(0, refFieldFromPrevFlow.lastIndexOf("__c")) + '__r';
                    if(inputFlowData[lookupMappingField]){
                        item[lookupMappingField] = inputFlowData[lookupMappingField];
                    }
                }
            });    
        }
        
        
        console.log('here');
        console.log(item);
        
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
    },
    
    
    getAvailableFlowActions : function(component){
        var availableFlowAction = component.get('v.availableFlowAction');
        var availableActions = component.get('v.availableActions');
        debugger;
        if(availableActions){
            for (var i = 0; i < availableActions.length; i++) {
                availableFlowAction.push(availableActions[i]);
            }
            
            component.set('v.availableFlowAction', availableFlowAction);
        }
        
    },
    
    navigateFlow: function(component, event){
        var self = this;
        // refresh output flow value with its real data
        if(event.getParam('Payload').payload === 'NEXT' || event.getParam('Payload').payload === 'FINISH'){
            var child = component.find('S360_FormBuilderStandard');
            
            if(component.get('v.formFlowAction') === 'pass_data_only'){
                child.refreshOutputFlowValue();    
                
                var navigate = component.get('v.navigateFlow');
                navigate(event.getParam('Payload').payload);
            }else if(component.get('v.formFlowAction') === 'save_only'){
                self.upsert(component, undefined, function(data){
                    var data = {Id: data.Id};
                    component.set('v.outputFlow', JSON.stringify(data));
                    
                    var navigate = component.get('v.navigateFlow');
                    navigate(event.getParam('Payload').payload);    
                });
            }else if(component.get('v.formFlowAction') === 'save_and_pass'){
                self.upsert(component, undefined, function(data){
                    component.set('v.outputFlow', JSON.stringify(data));
                    
                    var navigate = component.get('v.navigateFlow');
                    navigate(event.getParam('Payload').payload);    
                });
            }
        }else{
            var navigate = component.get('v.navigateFlow');
            navigate(event.getParam('Payload').payload);
        }
        
    }
})