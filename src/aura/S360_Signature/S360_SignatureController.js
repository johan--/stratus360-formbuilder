({
    doInit : function(component, event, helper) {
        helper.handleInit(component, event);
    },
    saveSignatureOnClick : function(component, event, helper){
        helper.handleSaveSignature(component, event);
    },
    clearSignatureOnClick : function(component, event, helper){
        helper.clearCanvas(component, event);
    }
})