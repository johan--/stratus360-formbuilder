({
    MAX_FILE_SIZE: 4500000, //Max file size 4.5 MB 
    CHUNK_SIZE: 750000,      //Chunk Max size 750Kb 
    
    uploadHelper: function(component, event, fileInput, lenOfFileInput, currIndex) {
        component.set("v.showLoadingSpinner", true);
        //Get the array of files
        
        //Get first file
        var self = this;
       
            var file = fileInput[currIndex];
            
            if (file.size > self.MAX_FILE_SIZE) {
                component.set("v.showLoadingSpinner", false);
                alert('File size cannot exceed ' + self.MAX_FILE_SIZE + ' bytes.\n' + ' Selected file size: ' + file.size);
                return;
            }
     
            // create a FileReader object 
            var objFileReader = new FileReader();
            // set onload function of FileReader object   
            objFileReader.onload = $A.getCallback(function() {
                var fileContents = objFileReader.result;
                var base64 = 'base64,';
                var dataStart = fileContents.indexOf(base64) + base64.length;
     
                fileContents = fileContents.substring(dataStart);
                // call the uploadProcess method 
                var done = self.uploadProcess(component, file, fileContents, fileInput, lenOfFileInput, currIndex);
            });
     
            objFileReader.readAsDataURL(file);
    },
 
    uploadProcess: function(component, file, fileContents, fileInput, lenOfFileInput, currIndex) {
        // set a default size or startpostiton as 0 
        var startPosition = 0;
        // calculate the end size or endPostion using Math.min() function which is return the min. value   
        var endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
 
        // start with the initial chunk, and set the attachId is null in begin
        this.uploadInChunk(component, file, fileContents, startPosition, endPosition, '', fileInput, lenOfFileInput, currIndex);
    },
 
 
    uploadInChunk: function(component, file, fileContents, startPosition, endPosition, attachId, fileInput, lenOfFileInput, currIndex) {
        // call the apex method 'saveTheChunk'
        var getchunk = fileContents.substring(startPosition, endPosition);
        var action = component.get("c.saveTheChunk");
        action.setParams({
            parentId: component.get("v.parentId"),
            fileName: file.name,
            base64Data: encodeURIComponent(getchunk),
            contentType: file.type,
            fileId: attachId
        });
 		
        var createNewAttachmentMapperAction = component.get("c.createNewAttachmentMapper");
       
        
        // set call back 
            action.setCallback(this, function(response) {
                // store the response / Attachment Id   
                attachId = response.getReturnValue();
                var state = response.getState();
                
                
                createNewAttachmentMapperAction.setParams({
                    parentId: component.get("v.parentId"),
                    attachId: attachId,
                    fieldName: component.get("v.fieldName"),
                    fileName: file.name,
                    customObject: component.get("v.master")
                });
                
                createNewAttachmentMapperAction.setCallback(this, function(response){
                    var valid = response.getReturnValue();
                    if(!valid){
                        component.set("v.statusFLS", "You do not have permission to perform this action");
                        var divFLS = document.getElementById("divFLS");
                        divFLS.className="unhidden";
                    }
                    var state = response.getState();  
                    if (state ==="ERROR"){
                        var errors = response.getError();
                        console.log(errors);
                    }
                });
                $A.enqueueAction(createNewAttachmentMapperAction);
                
            if (state === "SUCCESS") {
                // update the start position with end postion
                startPosition = endPosition;
                endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
                // check if the start postion is still less then end postion 
                // then call again 'uploadInChunk' method , 
                // else, diaply alert msg and hide the loading spinner
                
                
                if (startPosition < endPosition) {
                    this.uploadInChunk(component, file, fileContents, startPosition, endPosition, attachId);
                } else {
                    
                    if((currIndex+1)<lenOfFileInput){
                    	this.uploadHelper(component, event, fileInput, lenOfFileInput, currIndex+1);
                        return;
                    }
                    else{
                        component.set("v.showLoadingSpinner", false);
                        component.set("v.FileList", []);
                        this.getFiles(component);
                        return;
                    }
                    
                }
                // handel the response errors        
            } else if (state === "INCOMPLETE") {
                alert("From server: " + response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        // enqueue the action
        $A.enqueueAction(action);
    },
    
    
    createAttachmentMapperFromExistingFile: function(component, fieldName, fileList, fileListLength, currIndex){
    	var file = fileList[currIndex];
        var createNewAttachmentMapperAction = component.get("c.createNewAttachmentMapper");
        
        createNewAttachmentMapperAction.setParams({
                    parentId: component.get("v.parentId"),
                    attachId: file.S360_FA__attachId__c,
                    fieldName: fieldName,
                    fileName: file.S360_FA__fileName__c,
            		customObject: component.get("v.master")
                });
                
                createNewAttachmentMapperAction.setCallback(this, function(response){
                    var state = response.getState();  
                    
                    if (state ==="ERROR"){
                        var errors = response.getError();
                        console.log(errors);
                    }else{
                        var valid = response.getReturnValue();
                        if(valid){
                            if((currIndex+1)<fileListLength){
                                this.createAttachmentMapperFromExistingFile(component, fieldName, fileList, fileListLength, currIndex+1);
                            }else{
                                this.getFiles(component);
                                return;
                            }
                        }else{ 
                            component.set("v.statusFLS", "You do not have permission to perform this action");
                            var divFLS = document.getElementById("divFLS");
                            divFLS.className="unhidden";
                        }
                    }
                });
                $A.enqueueAction(createNewAttachmentMapperAction);
	},
    getFiles: function(component){
        var allFiles = [];
        var action = component.get("c.getAttachmentList");
        var action2 = component.get("c.getMyAttachmentList");
        action.setParams({
            parentId: component.get("v.parentId"),
            fieldName: component.get("v.fieldName"),
            customObject:  component.get("v.master")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state ==="ERROR"){
                alert("ERROR uploading your file");
                var errors = response.getError();
                console.log(errors);
            }else{
				var a = response.getReturnValue();
                for(var i = 0; i<a.length; i++){
                    a.selected = false;
                }
                action2.setParams({
                    parentId: component.get("v.parentId"),
                    fieldName: component.get("v.fieldName"),
                    customObject:  component.get("v.master")
                });
                action2.setCallback(this, function(response){
                    var state = response.getState();
                    if (state ==="ERROR"){
                        alert("ERROR uploading your file");
                        var errors = response.getError();
                        console.log(errors);
                    }else{
                        var b = response.getReturnValue();
                        component.set("v.myFilesList", b);
                        for(var i = 0; i<a.length; i++){
                            var valid = true;
                            for(var j = 0; j<b.length; j++){
                                if(a[i].S360_FA__attachId__c == b[j].S360_FA__attachId__c){
                                    valid = false;
                                }
                            }
                            if(valid){
                                allFiles.push(a[i]);
                            }
                        }
                        component.set("v.allFilesList", allFiles);
                    }
                    
                });
                $A.enqueueAction(action2);
            }
        });
        $A.enqueueAction(action);
        
        
        
    },
})