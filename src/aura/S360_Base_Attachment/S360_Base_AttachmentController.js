({
    doSave: function(component, event, helper) {
        
        if (component.find("fileId").get("v.files").length > 0) {
            helper.uploadHelper(component, event);
        } else {
            alert('Please Select a Valid File');
        }
    },
 
    handleFilesChange: function(component, event, helper) {
        /*var fileList = [];
        len = event.getSource().get("v.files").length;
        alert("length is "+len);
       
        for(var i = 0; i<len; i++){
            fileList.push(event.getSource().get("v.files")[i]);
        }
        component.*/
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
	},
    uploadFileClientSide: function(component, event, helper){
        alert("uploaded:"+event.getParam("files").length);
        return;
    }
})