({
	fireChangeEvent : function(component) {
        var evt = component.getEvent('OnChange');
        evt.setParams({
            "CompId": component.get('v.CompId'),
            "Payload": component.get('v.Value')
        });
        evt.fire();
	},
    
    setDefaultValue : function(component) {
		if(component.get('v.Value') == '' || component.get('v.Value') == undefined)
        {
            if(component.get('v.DefaultValue') != '' && component.get('v.DefaultValue') != undefined)
            {
                component.set('v.Value',component.get('v.DefaultValue'));
            }
        }
	},

    toggleErrorMessage: function(component, status, message){
        if(status === true){
            component.set('v.Valid', true);
        }else {
            component.set('v.Valid', false);
            component.set('v.Message', message);
        }
    },

    validateRequireField: function(component){
        // validate required field
        if(!component.get('v.Value')){
            this.toggleErrorMessage(component, false, $A.get("$Label.c.S360_Field_Required"));
        }else{
            this.toggleErrorMessage(component, true);
        }
    },

    validateField: function(component){
        // validate field
        var jsonLogicData = {
            "value": component.get('v.Value'),
            "name": component.get('v.CompId')
        }

        if(jsonLogic != undefined && jsonLogic != ''){
            
            //JSLogic Validation
            var validateJson = component.get('v.JsonLogic');
            
            if(validateJson != undefined && validateJson != "") {
                var valid = jsonLogic.apply(validateJson, jsonLogicData);
                
                this.toggleErrorMessage(component, valid, component.get('v.FailureValidationMessage'));
            }   
        }
    }
})