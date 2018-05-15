({
    doInit: function(component, event, helper){
        var a = [];
        var action = component.get("c.getAttachmentList");
        action.setParams({
            parentId: component.get("v.parentId")
        });
        alert("HI");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state ==="ERROR"){
                alert("ERROROR");
                var errors = response.getError();
                console.log(errors);
            }else{
				var a = response.getReturnValue();
                component.set("v.allFilesList", a);
            }
            
        });
        $A.enqueueAction(action);
        
        
        
    },
    doSave: function(component, event, helper) {
        
        if (component.find("fileId").get("v.files").length > 0) {
            helper.uploadHelper(component, event);
        } else {
            alert('Please Select a Valid File');
        }
    },
 
    handleFilesChange: function(component, event, helper) {
        component.set("v.FileList",event.getSource().get("v.files"));
    },
    showDiv : function(component, event, helper) {
        document.getElementById('uploadDiv').style.display = 'block';
	},

    hideDiv : function(component, event, helper){
    	document.getElementById('uploadDiv').style.display = 'none';
	},
    
    showModal: function(component, event, helper){
    	document.getElementById('modalWindow').style.display = 'block';
	},
    
    closeModal: function(component, event, helper){
    	document.getElementById('modalWindow').style.display = 'none';
	}
})