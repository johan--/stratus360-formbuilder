({
    MAX_FILE_SIZE: 11000000,
    /* 6 000 000 * 3/4 to account for base64 */
    CHUNK_SIZE: 900000,
    /* Use a multiple of 4 */
    
    getUrlParam: function(sParam) {
        var params = decodeURIComponent(window.location.search.substring(1));
        params = params.split('&');
        for (var i = 0; i < params.length; i++) {
            var targetParam = params[i].split('=');
            if (targetParam[0] === sParam) {
                return targetParam[1];
            }
        }
    },
    
    upsert: function(component, sender, callback) {
        //debugger;
        console.log(JSON.stringify(component.get("v.Data")));
        console.log('data to save');
        for(var i in component.get('v.Data')){
            if(component.get('v.Data').hasOwnProperty(i))
                console.log(i + '' +component.get('v.Data')[i]);
        }
        debugger;
        var self = this;
        var child;
        
        if (component.get('v.componentType') === 'Standard') {
            child = component.find('S360_FormBuilderStandard');
        } else {
            child = component.find('S360_FormBuilderCustom');
        }
        try {
            /*var isSignatureEnabled = component.get('v.isSignatureEnabled');
      var canvasDataUrl;

      if (isSignatureEnabled) {
        canvasDataUrl = self.getExactSignatureDataUrl(component.get('v.canvas'));
        if (!canvasDataUrl) {
          isSignatureEnabled = false;
        }
        canvasDataUrl = canvasDataUrl.replace(/^data:image\/(png|jpg);base64,/, "");
      }*/
        // code above already handled in startdard/custom component in submitEvent helper
        var isSignatureEnabled = component.get('v.isSignatureEnabled');
        var canvasDataUrl = component.get('v.canvasDataUrl');
        
        var action = component.get('c.saveUpsertRecord');
        //debugger;
        var data1;
        debugger;
        // if we save it to big object
        if (component.get("v.FormConfig").S360_FA__Save_to_Storage__c === true) {
            data1 = component.get('v.Data');
            
            data1.RecordTypeId = component.get("v.FormConfig").S360_FA__Record_Type__c;
            console.log("ID" + JSON.stringify(data1.Id));
            var id = data1.Id;
            
            delete data1.Id;
            data1 = {
                S360_FA__Record__c: JSON.stringify(data1),
                sobjectType: 'S360_FA__Storage__c'
            };
            
            if (id) {
                data1.Id = id;
            }
            
            data1.S360_FA__Heroku_Owner__c = component.get('v.herokuOwner');
        } else {
            data1 = component.get('v.Data');
            data1.RecordTypeId = component.get("v.FormConfig").S360_FA__Record_Type__c;
            console.log("ID" + JSON.stringify(data1.Id));
        }
        
        debugger;
        action.setParams({
            "data": data1,
            "relatedData": component.get('v.RelatedData'),
            "isSignatureEnabled": isSignatureEnabled,
            "signatureCompId": component.get('v.signatureCompId'),
            "signatureData": canvasDataUrl,
            "isSaveToStorage": component.get("v.FormConfig").S360_FA__Save_to_Storage__c
        });
        action.setCallback(this, function(response) {
            debugger;
            if (component.isValid() && response.getState() == 'SUCCESS') {
                if (response.getReturnValue().status == true) {
                    debugger;
                    var dataup = component.get("v.Data");
                    dataup["Id"] = response.getReturnValue().data.Id;
                    component.set("v.Data", dataup);
                    child = component.find('S360_FormBuilderStandard');
                    child.set("v.Data", dataup);
                    debugger;
                    console.log(component.get("v.Data.Id"));
                    
                    // refresh the data
                    // component.set('v.Data', response.getReturnValue().data);
                    
                    // if we have attachment to upload
                    if (sender) {
                        if (component.get('v.AttachmentsData').length > 0) {
                            self.readFile(component, 0, child, sender, callback, response);
                        } else {
                            child.afterSubmit(sender, 'SUCCESS', $A.get("$Label.c.S360_base_default_success_message"));
                            
                            if (callback != undefined) {
                                callback(response.getReturnValue().data);
                            }
                        }
                    } else {
                        if (callback != undefined) {
                            callback(response.getReturnValue().data);
                        }
                    }
                } else {
                    console.log("ERRRRRROR " + response.getReturnValue().message)
                    child.afterSubmit(sender, 'ERROR', response.getReturnValue().message);
                }
                
                
            } else if (response.getState() == 'INCOMPLETE') {
                child.afterSubmit(sender, 'INCOMPLETE', $A.get("$Label.c.S360_base_offline_message"));
            }
        });
        $A.enqueueAction(action);
    } catch (e) {
        child.afterSubmit(sender, 'ERROR', $A.get("$Label.c.S360_base_offline_message"));
    }
  },
    /*recordTypeMap : function(component, formConfig,data){
      //debugger;
      if(formConfig.S360_FA__Record_Type_Mapping__c && this.getUrlParam('id') && data.RecordTypeId){
          var map = JSON.parse(formConfig.S360_FA__Record_Type_Mapping__c);
          var id = data.RecordTypeId;
          var newForm =  map[id].Name;
          console.log(newForm);
          var url = window.location.href;
          var formname = this.getUrlParam('formname');
          //debugger;
          url = url.replace(formname,newForm);
          //debugger;
          window.location.replace(url);
      } else if (formConfig.S360_FA__Record_Type_Mapping__c && component.get('v.recordId') && data.RecordTypeId){
          //debugger;
          var map = JSON.parse(formConfig.S360_FA__Record_Type_Mapping__c);
          var id = data.RecordTypeId;
          var newForm =  map[id].Name;
          return newForm;

      }
  },*/
    recordTypeMap: function(component, formConfig, data) {
        if (formConfig.S360_FA__Record_Type_Mapping__c && (component.get('v.recordId') || this.getUrlParam('id')) && data.RecordTypeId) {
            //debugger;
            var map = JSON.parse(formConfig.S360_FA__Record_Type_Mapping__c);
            var id = data.RecordTypeId;
            var newForm = map[id].Name;
            return newForm;
            
        }
    },
    populateData: function(component, formConfig, data) {
        // convert the inputFlowMap to json data
        var inputFlowMap = {};
        if (formConfig.S360_FA__Input_Flow_Map__c) {
            inputFlowMap = JSON.parse(formConfig.S360_FA__Input_Flow_Map__c);
        }
        
        // convert string data from previous flow to json
        var inputFlowData = {};
        if (component.get('v.inputFlow')) {
            inputFlowData = JSON.parse(component.get('v.inputFlow'));
        }
        
        console.log('here');
        console.log(inputFlowData);
        console.log(inputFlowMap);
        //debugger;
        
        // if we dont save it to big object
        if (formConfig.S360_FA__Field__c && formConfig.S360_FA__Save_to_Storage__c == false) {
            var item = {
                'sobjectType': formConfig.S360_FA__Primary_Object__c,
                'Id': (data != undefined && data['Id']) ? data['Id'] : undefined,
                'Name': (data != undefined && data['Name']) ? data['Name'] : undefined,
            };
            
            formConfig.S360_FA__Field__c.split(',').forEach(function(field) {
                
                if (data != undefined && data[field]) {
                    item[field] = data[field];
                } else {
                    item[field] = '';
                }
                
                // if type refference
                if (data != undefined && data.hasOwnProperty(field.substr(0, field.lastIndexOf("__c")) + '__r')) {
                    var nfield = field.substr(0, field.lastIndexOf("__c")) + '__r';
                    if (data != undefined && data[nfield]) {
                        item[nfield] = data[nfield];
                    } else {
                        item[nfield] = '';
                    }
                }
                
                // if we have the data from flow, than use that data
                var refFieldFromPrevFlow = inputFlowMap[field];
                if (refFieldFromPrevFlow) {
                    item[field] = refFieldFromPrevFlow ? inputFlowData[refFieldFromPrevFlow] ? inputFlowData[refFieldFromPrevFlow] : item[field] : item[field];
                    
                    // if our data is lookup
                    var lookupMappingField = refFieldFromPrevFlow.substr(0, refFieldFromPrevFlow.lastIndexOf("__c")) + '__r';
                    if (inputFlowData[lookupMappingField]) {
                        item[lookupMappingField] = inputFlowData[lookupMappingField];
                    }
                }
            });
        } else {
            item = data || {};
            item['sobjectType'] = formConfig.S360_FA__Primary_Object__c;
            item['Id'] = (data != undefined && data['Id']) ? data['Id'] : undefined;
            item['Name'] = (data != undefined && data['Name']) ? data['Name'] : undefined;
            
            for (var keyF in inputFlowMap) {
                if (inputFlowMap.hasOwnProperty(keyF)) {
                    var refFieldFromPrevFlow = inputFlowMap[keyF];
                    if (refFieldFromPrevFlow) {
                        if (item[keyF]) {
                            item[keyF] = refFieldFromPrevFlow ? inputFlowData[refFieldFromPrevFlow] ? inputFlowData[refFieldFromPrevFlow] : item[keyF] : item[keyF];
                        } else {
                            item[keyF] = refFieldFromPrevFlow ? inputFlowData[refFieldFromPrevFlow] ? inputFlowData[refFieldFromPrevFlow] : undefined : undefined;
                        }
                        
                        
                        // if our data is lookup
                        var lookupMappingField = refFieldFromPrevFlow.substr(0, refFieldFromPrevFlow.lastIndexOf("__c")) + '__r';
                        if (inputFlowData[lookupMappingField]) {
                            item[lookupMappingField] = inputFlowData[lookupMappingField];
                        }
                    }
                }
            }
        }
        
        
        console.log('here');
        console.log(item);
        
        return item;
    },
    
    getExactSignatureDataUrl: function(canvas) {
        var ctx = canvas.getContext('2d');
        
        var w = canvas.width,
            h = canvas.height,
            pix = {
                x: [],
                y: []
            },
            imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
            x, y, index;
        
        for (y = 0; y < h; y++) {
            for (x = 0; x < w; x++) {
                index = (y * w + x) * 4;
                if (imageData.data[index + 3] > 0) {
                    
                    pix.x.push(x);
                    pix.y.push(y);
                    
                }
            }
        }
        pix.x.sort(function(a, b) {
            return a - b
        });
        pix.y.sort(function(a, b) {
            return a - b
        });
        var n = pix.x.length - 1;
        
        w = pix.x[n] - pix.x[0];
        h = pix.y[n] - pix.y[0];
        var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);
        
        
        var hl = document.createElement('canvas');
        hl.width = w;
        hl.height = h;
        
        hl.getContext('2d').putImageData(cut, 0, 0);
        
        return hl.toDataURL();
    },
    
    
    getAvailableFlowActions: function(component) {
        var availableFlowAction = component.get('v.availableFlowAction');
        var availableActions = component.get('v.availableActions');
        //debugger;
        if (availableActions) {
            for (var i = 0; i < availableActions.length; i++) {
                availableFlowAction.push(availableActions[i]);
            }
            
            component.set('v.availableFlowAction', availableFlowAction);
        }
        
    },
    
    navigateFlow: function(component, event) {
        debugger;
        this.generateJSONString(component);
        
        var self = this;
        // refresh output flow value with its real data
        if (event.getParam('Payload').payload === 'NEXT' || event.getParam('Payload').payload === 'FINISH') {
            var child = component.find('S360_FormBuilderStandard');
            
            if (component.get('v.formFlowAction') === 'pass_data_only') {
                child.refreshOutputFlowValue();
                
                var navigate = component.get('v.navigateFlow');
                navigate(event.getParam('Payload').payload);
            } else if (component.get('v.formFlowAction') === 'save_only') {
                self.upsert(component, undefined, function(data) {
                    var data = {
                        Id: data.Id
                    };
                    component.set('v.outputFlow', JSON.stringify(data));
                    
                    var navigate = component.get('v.navigateFlow');
                    navigate(event.getParam('Payload').payload);
                });
            } else if (component.get('v.formFlowAction') === 'save_and_pass') {
                self.upsert(component, undefined, function(data) {
                    
                    component.set('v.outputFlow', JSON.stringify(data));
                    
                    var navigate = component.get('v.navigateFlow');
                    navigate(event.getParam('Payload').payload);
                });
            }
        } else {
            var navigate = component.get('v.navigateFlow');
            navigate(event.getParam('Payload').payload);
        }
        
    },
    
    readFile: function(component, indexOfFile, mainOp_child, mainOp_sender, mainOp_callback, mainOp_response) {
        var attachments = component.get('v.AttachmentsData');
        if (attachments.length > 0 && indexOfFile < attachments.length) {
            var fileToUpload = attachments[indexOfFile];
            
            this.saveAttachment(component, fileToUpload, indexOfFile, mainOp_child, mainOp_sender, mainOp_callback, mainOp_response);
        }
    },
    
    saveAttachment: function(comp, payload, indexOfFile, mainOp_child, mainOp_sender, mainOp_callback, mainOp_response) {
        debugger;
        var base64Mark = 'base64,';
        var dataStart = payload.contents.indexOf(base64Mark) + base64Mark.length;
        var fileContents = payload.contents.substring(dataStart);
        
        
        this.upload(comp, payload.name, payload.type, fileContents, indexOfFile,
                    mainOp_child, mainOp_sender, mainOp_callback, mainOp_response);
    },
    
    upload: function(component, fileName, fileType, fileContents, indexOfFile,
                     mainOp_child, mainOp_sender, mainOp_callback, mainOp_response) {
        debugger;
        var fromPos = 0;
        var toPos = Math.min(fileContents.length, fromPos + this.CHUNK_SIZE);
        
        // start with the initial chunk
        component.set('v.showLoading', true);
        this.uploadChunk(component, fileName, fileType, fileContents, fromPos, toPos, '', this.CHUNK_SIZE, indexOfFile,
                         mainOp_child, mainOp_sender, mainOp_callback, mainOp_response);
    },
    
    uploadChunk: function(component, fileName, fileType, fileContents, fromPos, toPos, attachId, chunkSize, indexOfFile,
                          mainOp_child, mainOp_sender, mainOp_callback, mainOp_response) {
        
        // call this dummy fuction just for setting up action.setCallback
        var action = component.get("c.saveTheChunk");
        var chunk = fileContents.substring(fromPos, toPos);
        
        debugger;
        
        action.setParams({
            parentId: mainOp_response.getReturnValue().data['Id'],
            fileName: fileName,
            base64Data: encodeURIComponent(chunk),
            contentType: fileType,
            fileId: attachId
        });
        
        var self = this;
        action.setCallback(this, function(a) {
            debugger;
            var state = a.getState();
            if (state == "SUCCESS") {
                attachId = a.getReturnValue();
                fromPos = toPos;
                toPos = Math.min(fileContents.length, fromPos + chunkSize);
                // recursive method
                if (fromPos < toPos) {
                    console.log('fromPos:' + fromPos);
                    self.uploadChunk(component, fileName, fileType, fileContents, fromPos, toPos, attachId, chunkSize, indexOfFile,
                                     mainOp_child, mainOp_sender, mainOp_callback, mainOp_response);
                } else {
                    // finish upload
                    var attachments = component.get('v.AttachmentsData');
                    indexOfFile++;
                    
                    // check if we have another attachment
                    if (indexOfFile < attachments.length) {
                        self.readFile(component, indexOfFile, mainOp_child, mainOp_sender, mainOp_callback, mainOp_response);
                    } else {
                        mainOp_child.afterSubmit(mainOp_sender, 'SUCCESS', $A.get("$Label.c.S360_base_default_success_message"));
                        
                        if (mainOp_callback != undefined) {
                            mainOp_callback(mainOp_response.getReturnValue().data);
                        }
                    }
                }
                
            } else if (state == "ERROR") {
                console.log(a.getError());
                component.set('v.showLoading', false);
                self.showToast(component, 'error', $A.get('$Label.c.attachment_not_created'));
            }
        });
        
        $A.enqueueAction(action);
        
    },
    autoSave: function(component, event) {
        debugger;
        var self = this;
        if (component.get("v.autoSaveOn") && !component.get("v.Lockdown")) {
            var interval = component.get("v.autoSaveInterval");
            //console.log(component.get("v.autoSaveOn"));
            if (true) {
                setInterval(
                    $A.getCallback(function() {
                        self.upsert(component);
                    }), 1000 * interval);
            }
        }
    },
    generateJSONString: function(component){
        debugger;
        component.set('v.StringData', JSON.stringify(component.get('v.Data')))
        component.set('v.StringAttachments', JSON.stringify(component.get('v.AttachmentsData')))
    }
})