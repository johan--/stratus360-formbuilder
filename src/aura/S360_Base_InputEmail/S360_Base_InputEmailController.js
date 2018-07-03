({
	myAction : function(component, event, helper) {

	},
    //EmailValidation
    handleOnChange:function(component, event, helper) {
        var isValidEmail = true;
        var emailField = component.find("CompId");
        var emailFieldValue = component.get("v.Value");
        var regExpEmailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        debugger;
        if(!$A.util.isEmpty(emailFieldValue)){
            debugger;
            if(emailFieldValue.match(regExpEmailformat)){
                helper.toggleErrorMessage(component, true);
                isValidEmail = true;
            }else{
                helper.toggleErrorMessage(component, false, "Please Enter a Valid Email Address");
                isValidEmail = false;
            }
        }
        if(isValidEmail){
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