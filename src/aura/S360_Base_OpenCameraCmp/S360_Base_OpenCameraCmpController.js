({
	handleOnClick : function(comp, evt, helper) {
		switch(evt.getParam('CompId')){
            case comp.get('v.ButtonId'):
                evt.stopPropagation();
                helper.openCamera(comp);
                break;
        }
	},
    
    onFileChanged : function(comp, evt, helper){
        helper.handleCameraCaptured(comp);
    }
})