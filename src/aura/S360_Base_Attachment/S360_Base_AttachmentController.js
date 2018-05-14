({
    handleUploadFinished: function(component, event, helper){
        alert("WEEOOO");
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