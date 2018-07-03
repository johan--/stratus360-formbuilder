({
	handleOnChange: function(component, event, helper){
        //debugger;
        var evt = component.getEvent('OnChange');
        evt.setParams({
            "CompId": component.get('v.CompId'),
            "Payload": component.get('v.Value')
        });
        evt.fire();

        //Updating data for validation
        var CompId = component.get('v.CompId');
        var Value = component.get('v.Value');

        //Function definitions for use in JSLogic
        var getVal = function(CompId){
            return component.get('v.Data[' + CompId + ']');
        };

        var getThis = function(){
            return component.get('v.CompId');
        };

        //Adding Functions to JSLogic
        if(jsonLogic != undefined && jsonLogic != ''){
            jsonLogic.add_operation("get", getVal);
            jsonLogic.add_operation("this", getThis);

            //JSLogic Validation
            var validateJson = component.get('v.Json');

            if(validateJson != undefined && validateJson != "") {
                var valid = jsonLogic.apply(validateJson);

                if(valid === true){
                    component.set('v.Valid', true);
                }
                else {
                    component.set('v.Valid', false);
                    component.set('v.Message', valid);
                }
            }
        }
    },

    handleOnBlur: function(component, event, helper){
        var evt = component.getEvent('OnBlur');
        evt.setParams({
            "CompId": component.get('v.CompId')
        });
        evt.fire();
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