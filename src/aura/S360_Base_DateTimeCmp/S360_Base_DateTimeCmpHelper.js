({
	toggleErrorMessage: function(component, status, message){
        if(status === true){
            component.set('v.Valid', true);
        }else {
            component.set('v.Valid', false);
            component.set('v.Message', message);
        }
    },

    validateRequireField: function(component){
        debugger;
        // validate required field
        if(!component.get('v.Value')){
            this.toggleErrorMessage(component, false, $A.get("$Label.c.S360_Field_Required"));
        }else{
            this.toggleErrorMessage(component, true);
            this.validateField(component);
        }
    },

    validateField: function(component){
        // validate field
        var jsonLogicData = {
            "value": component.get('v.Value'),
            "name": component.get('v.CompId'),
			"data": component.get('v.Data')
        }

        if(jsonLogic != undefined && jsonLogic != ''){
            
            debugger;
            
            //JSLogic Validation
            var validateJson = component.get('v.JsonLogic');
            
            if(validateJson != undefined && validateJson != "") {
                var valid = jsonLogic.apply(validateJson, jsonLogicData);
                
                this.toggleErrorMessage(component, valid, component.get('v.FailureValidationMessage'));
            }   
        }
    }
})