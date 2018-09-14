({
    MAX_FILE_SIZE: 11000000, /* 6 000 000 * 3/4 to account for base64 */
    CHUNK_SIZE: 900000, /* Use a multiple of 4 */
    
    getAttachment : function(comp, hlp, message){
    	//debugger;
        comp.set('v.showLoading', true);
        
        var filterCondition = '';
        if(comp.get('v.ParentId')){
            filterCondition = "ParentID = '" + comp.get('v.ParentId')+"'";
        }else{
            filterCondition = 'ParentID = null';
        }
        var deleteme = comp.get('v.FormId');
        var action = comp.get('c.getObjectAttachment');
        
        action.setStorable();
        action.setParams({
            "filterCondition": filterCondition,
            "pOffset": comp.get('v.offset'),
            "pSize": comp.get('v.pageSize'),
            "sortDirection": comp.get('v.sort'),
            "orderBy": comp.get('v.orderBy'),
            "ReportId": comp.get('v.ParentId'),
            "FormId": comp.get('v.FormId')
        });
        action.setCallback(this, function(res){
            //debugger;
            if(comp.isValid() && res.getState() == 'SUCCESS'){
                comp.set('v.objectPermission', res.getReturnValue().data.ObjectPermission);
                
                if(res.getReturnValue().data.ObjectPermission.isAccessible){
                 	if(res.getReturnValue().status){
                        comp.set('v.length', res.getReturnValue().data.length)
                        comp.set('v.objectWrapper', res.getReturnValue().data.objectWrapper);
                        
                        var a =res.getReturnValue().data.objectWrapper;
                        console.log('HEre');
                        for(var i in a){
                            console.log(a[i]);
                        }
                        
                        if(hlp){
                            setTimeout(function(){
                            	hlp.notifyTable(comp);
                            	hlp.notifyPagination(comp);    
                            },2000);
                        }
                        
                        // populate attachment data
                        if(res.getReturnValue().data.length > 0){
                            var tmpAttachData = [];
                            res.getReturnValue().data.objectWrapper.forEach(function(attach){
                                tmpAttachData.push({
                                    name: attach.objects.Name,
                                    id: attach.objects.Id
                                })
                            })
                            debugger;
                            comp.set('v.AttachmentsData', tmpAttachData);
                        }
                        
                        if(message){
                            hlp.showToast(comp, 'success', message);
                        }
                    }else{
                        var errorMessage = [];
                        res.getReturnValue().messages.forEach(function(e){
                            errorMessage.push(e);
                        });
                        hlp.showToast(comp, 'error', 'Failed to find data : (' + errorMessage.join(',') + ')');
                    }   
                }else{
                    hlp.showToast(comp, 'error', 'You don\'t have access to this object.');
                }
            }else if(res.getState() == 'ERROR'){
                var errorMessage = [];
                var error = res.getError();
                if(error){
                    error.forEach(function(e){
                        errorMessage.push(e.message);
                    });
                    
                    hlp.showToast(comp, 'error', 'Failed to find data : (' + errorMessage.join(',') + ')');
                } 
            }
            
            //hide loading spinner
        	comp.set('v.showLoading', false);
        });
        $A.enqueueAction(action);
    },
    
    notifyTable : function(comp){
        debugger;
        var tableCmp = comp.find('E_Rep_Attachment_Table_id');
        tableCmp.setDataReady(
            comp.get("v.sort"), 
            comp.get("v.orderBy"),
        	comp.get("v.objectWrapper"));
    },
    
    notifyPagination : function(comp){
        var pagination = comp.find('E_Rep_Attachment_Pagination_id');
		pagination.handlePageReady(
            comp.get("v.length"), 
            comp.get("v.offset"),
            comp.get("v.pageSize"));
    },
    
    showToast: function(comp, type, message){
        comp.set('v.TextMessage', message);
        comp.set('v.ToastType', type);
        var toastValue = comp.get('v.showToast');
        if(toastValue)
        {
            comp.set('v.showToast',false);
        }else
        {
            comp.set('v.showToast',true);
        }
        
    },
    
    saveAttachment: function(comp, payload){
        debugger;
        var base64Mark = 'base64,';
        var dataStart = payload.contents.indexOf(base64Mark) + base64Mark.length;
        var fileContents = payload.contents.substring(dataStart);
        
        
        this.upload(comp, payload.name, payload.type, fileContents);
    },
    
    upload: function(component, fileName, fileType, fileContents) {
        debugger;
        var fromPos = 0;
        var toPos = Math.min(fileContents.length, fromPos + this.CHUNK_SIZE);
        
        // start with the initial chunk
        component.set('v.showLoading', true);
        this.uploadChunk(component, fileName, fileType, fileContents, fromPos, toPos, '', this.CHUNK_SIZE);   
    },
    
    uploadChunk : function(component, fileName, fileType, fileContents, fromPos, toPos, attachId, chunkSize) {
        debugger;
        // call this dummy fuction just for setting up action.setCallback
        var action = component.get("c.saveTheChunk"); 
        var chunk = fileContents.substring(fromPos, toPos);

        action.setParams({
            parentId: component.get("v.ParentId"),
            fileName: fileName,
            base64Data: encodeURIComponent(chunk), 
            contentType: fileType,
            fileId: attachId
        });        

        var self = this;
        action.setCallback(this, function(a) {
            debugger;
            var state = a.getState();
            if(state == "SUCCESS"){
                attachId = a.getReturnValue();
                fromPos = toPos;
                toPos = Math.min(fileContents.length, fromPos + chunkSize); 
                // recursive method 
                if(fromPos < toPos) {
                    console.log('fromPos:'+fromPos);
                    self.uploadChunk(component, fileName, fileType, fileContents, fromPos, toPos, attachId, chunkSize);
                }else{
                    // finish upload
                    // update attachment table
                    self.getAttachment(component, self, $A.get('$Label.c.attachment_created'));
                }

            }else if(state == "ERROR"){
                console.log(a.getError());
                component.set('v.showLoading', false);
                self.showToast(component, 'error', $A.get('$Label.c.attachment_not_created'));
            }
        });

        $A.enqueueAction(action); 

    },

    putAttachment: function(component, payload){
        debugger;
        var objectWrapper = component.get('v.objectWrapper');
        if(!objectWrapper){
            objectWrapper = [];
        }

        objectWrapper.push({
            selected: false,
            payload: payload,
            objects: {
                Name: payload.name
            }
        });
        component.set('v.length', objectWrapper.length);
        component.set('v.objectWrapper', objectWrapper);

        this.notifyTable(component);
        this.notifyPagination(component);
    },

    toggleErrorMessage: function(component, status, message){
        if(status === true){
            component.set('v.Valid', true);
        }else {
            component.set('v.Valid', false);
            component.set('v.Message', message);
        }
    },
    
    generateUUID: function(){
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },
    
    createContentDocLink: function(component, cvid){
        var action = component.get("c.linkFile2parent");

        action.setParams({
            parentid: component.get("v.ParentId"),
            cvid: cvid
        });        

        var self = this;
        action.setCallback(this, function(a) {
            var state = a.getState();
            if(state == "SUCCESS"){
                // update attachment table
                self.getAttachment(component, self, $A.get('$Label.c.attachment_created'));
            }else if(state == "ERROR"){
                component.set('v.showLoading', false);
                self.showToast(component, 'error', $A.get('$Label.c.attachment_not_created'));
            }
        });

        $A.enqueueAction(action); 
    },
    
    getFiles : function(comp, hlp, message){
        comp.set('v.showLoading', true);
        
        var filterCondition = '';
        if(comp.get('v.ParentId')){
            filterCondition = "LinkedEntityId = '" + comp.get('v.ParentId')+"'";
        }else{
            filterCondition = 'LinkedEntityId = null';
        }
        var deleteme = comp.get('v.FormId');
        var action = comp.get('c.getFiles');
        
        action.setStorable();
        action.setParams({
            "filterCondition": filterCondition,
            "pOffset": comp.get('v.offset'),
            "pSize": comp.get('v.pageSize'),
            "sortDirection": comp.get('v.sort'),
            "orderBy": 'Title',
            "parentId": comp.get('v.ParentId'),
            "formId": comp.get('v.FormId')
        });
        action.setCallback(this, function(res){
            
            debugger;
            
            if(comp.isValid() && res.getState() == 'SUCCESS'){
                comp.set('v.objectPermission', res.getReturnValue().data.ObjectPermission);
                
                if(res.getReturnValue().data.ObjectPermission.isAccessible){
                 	if(res.getReturnValue().status){
                        var objectWrapper = [];
                        comp.set('v.length', res.getReturnValue().data.length)
                        
                        // let's parse from content version
                        if(res.getReturnValue().data.length > 0 && res.getReturnValue().data.objectWrapper){
                            res.getReturnValue().data.objectWrapper.forEach(function(i){
                                objectWrapper.push({
                                    selected: false,
                                    objects: {
                                        Name: i.objects.Title,
                                        Id: i.objects.ContentDocumentId
                                    }
                                })
                            });
                            
                            comp.set('v.objectWrapper', objectWrapper);
                        }
                        
                        var a =res.getReturnValue().data.objectWrapper;
                        
                        if(hlp){
                            setTimeout(function(){
                            	hlp.notifyTable(comp);
                            	hlp.notifyPagination(comp);    
                            },2000);
                        }
                        
                        // populate attachment data
                        if(res.getReturnValue().data.length > 0){
                            var tmpAttachData = [];
                            objectWrapper.forEach(function(attach){
                                tmpAttachData.push({
                                    name: attach.objects.Name,
                                    id: attach.objects.Id
                                })
                            })
                            
                            comp.set('v.AttachmentsData', tmpAttachData);
                        }
                        
                        if(message){
                            hlp.showToast(comp, 'success', message);
                        }
                    }else{
                        var errorMessage = [];
                        res.getReturnValue().messages.forEach(function(e){
                            errorMessage.push(e);
                        });
                        hlp.showToast(comp, 'error', 'Failed to find data : (' + errorMessage.join(',') + ')');
                    }   
                }else{
                    hlp.showToast(comp, 'error', 'You don\'t have access to this object.');
                }
            }else if(res.getState() == 'ERROR'){
                var errorMessage = [];
                var error = res.getError();
                if(error){
                    error.forEach(function(e){
                        errorMessage.push(e.message);
                    });
                    
                    hlp.showToast(comp, 'error', 'Failed to find data : (' + errorMessage.join(',') + ')');
                } 
            }
            
            //hide loading spinner
        	comp.set('v.showLoading', false);
        });
        $A.enqueueAction(action);
    },
})