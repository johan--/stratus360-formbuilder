({
    doInit : function(component, event, helper) {
        helper.handleInit(component, event);
    },
    saveSignatureOnClick : function(component, event, helper){
        helper.handleSaveSignature(component, event);
    },
    clearSignatureOnClick : function(component, event, helper){
        helper.clearCanvas(component, event);
    },
    
    handleValidationFail: function(component, event, helper){
        debugger;
        var params = event.getParam('arguments');
        var message = '';
        if (params) {
            message = params.message || component.get('v.FailureValidationMessage');
        }
        helper.toggleErrorMessage(component, false, message);
    },

    handleValidationSuccess: function(component, event, helper) {
      component.set('v.Valid', true);
      component.set('v.Message', "");
    },
    
    handleSetValidating: function(component, event, helper){
        debugger;
        var params = event.getParam('arguments');
        if (params) {
            component.set('v.IsValidating', params.status);
        }
    },
})