({
    //MAX_FILE_SIZE: 4500000, /* 6 000 000 * 3/4 to account for base64 */
    MAX_FILE_SIZE: 11000000, /* 6 000 000 * 3/4 to account for base64 */
    CHUNK_SIZE: 900000, /* Use a multiple of 4 */

    save : function(component) {
        var fileInput = component.find("fileSelected").getElement();
        var file = fileInput.files[0];
   
        if (file.size > this.MAX_FILE_SIZE) {
            alert('File size cannot exceed ' + this.MAX_FILE_SIZE + ' bytes.\n' +
              'Selected file size: ' + file.size);
            return;
        }
        
        var fr = new FileReader();

        var self = this;
        fr.onloadend = function() {
            var fileContents = fr.result;
            var base64Mark = 'base64,';
            var dataStart = fileContents.indexOf(base64Mark) + base64Mark.length;
            //debugger;
            fileContents = fileContents.substring(dataStart);
       
            self.upload(component, file, fileContents);
        };

        fr.readAsDataURL(file);
    },
        
    upload: function(component, file, fileContents) {
        var fromPos = 0;
        var toPos = Math.min(fileContents.length, fromPos + this.CHUNK_SIZE);
        //debugger;
        // start with the initial chunk
        this.uploadChunk(component, file, fileContents, fromPos, toPos, '', this.CHUNK_SIZE);   
    },
     
    uploadChunk : function(component, file, fileContents, fromPos, toPos, attachId, chunkSize) {
        // call this dummy fuction just for setting up action.setCallback
        var action = component.get("c.saveTheChunk"); 
        var chunk = fileContents.substring(fromPos, toPos);

        action.setParams({
            parentId: component.get("v.ParentId"),
            fileName: file.name,
            base64Data: encodeURIComponent(chunk), 
            contentType: file.type,
            fileId: attachId
        });        

        var self = this;
        action.setCallback(this, function(a) {
            var state = a.getState();
            if(state == "SUCCESS"){
                attachId = a.getReturnValue();
                fromPos = toPos;
                toPos = Math.min(fileContents.length, fromPos + chunkSize); 
                // recursive method 
                if(fromPos < toPos) {
                    console.log('fromPos:'+fromPos);
                    self.uploadChunk(component, file, fileContents, fromPos, toPos, attachId, chunkSize); 
                }else{
                    //alert('finishing');
                    //fire event to update the file Id
                    var fileEvent = component.getEvent("xFileIdEvent");

                    // Populate the event with the Instance Id
                    fileEvent.setParams({
                        "CompId" : component.get('v.CompId'),
                        "XFileId" : attachId
                    });
                    // Fire the event
                    fileEvent.fire();
                }

            }else if(state == "ERROR"){
                console.log('Error to upload document');
                //alert('Error to upload document');
                //fire event to notify failed save by empty id
                var fileEvent = component.getEvent("xFileIdEvent");
                fileEvent.setParams({
                    "CompId" : component.get('v.CompId'),
                    "XFileId" : ''
                });
                fileEvent.fire();
            }

        });

        window.setTimeout(
            $A.getCallback(function() {
                $A.enqueueAction(action); 
            }),1000
        );

     
    },
      
    getImageId: function(component) {
            var action = component.get("c.retrieveImageId");
            action.setParams({
                parentId : component.get("v.ParentId")
            });

            action.setCallback(this, function(response) {
                var state = response.getState();
                if (component.isValid() && state === "SUCCESS") {
                    component.set("v.ImageId", response.getReturnValue());
                }
            });
            $A.enqueueAction(action);
            
    }    
})