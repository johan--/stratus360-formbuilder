({
    doInit: function(component, event, helper){
        helper.getFiles(component);
    },

    deleteFile: function(component, event, help){
        var identification = event.currentTarget.id;
        var fileList = component.get("v.myFilesList");
        var file = fileList[identification];
        var valid = true;
        
        var action=component.get("c.deleteAttachmentMapper");
        action.setParams({
            parentId: component.get("v.parentId"),
            fieldName: file.S360_FA__fieldName__c,
            attachId: file.S360_FA__attachId__c,
            customObject:  component.get("v.master")
        });
                
        action.setCallback(this, function(response){
            var state = response.getState();  
            if (state ==="ERROR"){
                valid = response.getReturnValue();
                var errors = response.getError();
                console.log(errors);
            }else{
                valid = response.getReturnValue();
                if(!valid){
                    component.set("v.statusFLS", "You do not have permission to perform this action");
                    var divFLS = document.getElementById("divFLSDelete");
                    divFLS.className="unhidden";
                }
                else{
                    fileList.splice(identification, 1);
                    component.set("v.myFilesList",fileList);
                }
            }
        });
        $A.enqueueAction(action);
        
        
    },
    
    removeFromView: function(component, event, helper){
        var identification = event.currentTarget.id;
        var fileNames = component.get("v.FileList");
        fileNames.splice(identification, 1);
        component.set("v.FileList", fileNames);
        
		var fileQueue = component.get("v.fileQueue");
        fileQueue.splice(identification,1);
        component.set("v.fileQueue", fileQueue);
	},	
    
    bindCheckBoxValues: function(component, event, helper){
        var fileList = component.get("v.allFilesList");
        var fieldName = component.get("v.fieldName");
        console.log(fileList);
        var newFileList=[];
        for(var i = 0; i<fileList.length; i++){
            if(fileList[i].selected){
                newFileList.push(fileList[i]);
            }
        }
        helper.createAttachmentMapperFromExistingFile(component, fieldName, newFileList, newFileList.length, 0);
    },
    doSave: function(component, event, helper) {
        var fileInput = component.get("v.fileQueue");
        var lenOfFileInput = fileInput.length;
        
        if (fileInput.length > 0) {
            helper.uploadHelper(component, event, fileInput, lenOfFileInput, 0);
        } else {
            alert('Please Select a Valid File');
        }
    },
 
    handleFilesChange: function(component, event, helper) {
        var fileInput = component.find("fileId").get("v.files");
        var fileNames = component.get("v.FileList");
        var fileQueue = component.get("v.fileQueue");
        for(var i = 0; i<fileInput.length; i++){
            fileNames.push(fileInput[i].name);
            fileQueue.push(fileInput[i]);
        }
        component.set("v.FileList", fileNames);
        component.set("v.fileQueue", fileQueue);
    },
    showDiv : function(component, event, helper) {
        component.set("v.start","true");
        var displayDiv = component.find('uploadDiv')
        $A.util.toggleClass(displayDiv, "slds-show");
	},

    hideDiv : function(component, event, helper){
        if(component.get("v.start")=="true"	){
            var displayDiv = component.find('uploadDiv')
            $A.util.toggleClass(displayDiv, "slds-show");
        }
	},
    
    showModal: function(component, event, helper){
        	helper.getFiles(component);
    		var displayDiv = component.find('modalWindow')
            $A.util.toggleClass(displayDiv, "slds-show");
	},
    
    closeModal: function(component, event, helper){
        	component.set("v.FileList",[]);
        	component.set("v.fileQueue",[]);
    		var displayDiv = component.find('modalWindow')
            $A.util.toggleClass(displayDiv, "slds-show");
	},
    
    saveModal: function(component, event, helper){
        	
    		var displayDiv = component.find('modalWindow')
            $A.util.toggleClass(displayDiv, "slds-show");
	}
})