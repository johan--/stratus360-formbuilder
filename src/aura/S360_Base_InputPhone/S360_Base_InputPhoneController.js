({
    myAction : function(component, event, helper) {
        
    },
    scriptsLoaded: function(component, event, helper) {
        console.log('sccript loaded');
    },
    
    handleOnChange:function(component, event, helper) {
        var phonevalid=component.find("CompId");
        var phDetail=component.get("v.Value");
        var phcheck=phDetail.replace(/\W/g, '');
        
        if(phcheck.match(/[^0-9]/) || phcheck.length !=10){
            helper.toggleErrorMessage(component, false, "Please Enter a Valid phone number");
        } else {
            // validate required field
            helper.validateRequireField(component);
            // validate field
            helper.validateField(component);
        }
    },
    
    handleValidationFail: function(component, event, helper) {
        debugger;
        var params = event.getParam('arguments');
        var message = '';
        if (params) {
            message = params.message || component.get('v.FailureValidationMessage');
        }
        component.set('v.Valid', false);
        component.set('v.Message', message);
    },
    handleValidationSuccess: function(component, event, helper) {
        component.set('v.Valid', true);
        component.set('v.Message', "");
    },
    
})