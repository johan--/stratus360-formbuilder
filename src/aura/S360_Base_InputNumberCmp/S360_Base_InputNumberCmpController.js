({

    doInit: function(component, event, helper){
        helper.setDefaultValue(component);
    },

    onValueChange: function(component, event, helper){
        debugger;
        helper.setDefaultValue(component);

        // validate required field
        helper.validateRequireField(component);
        // validate field
        helper.validateField(component);

        helper.fireChangeEvent(component);
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
})