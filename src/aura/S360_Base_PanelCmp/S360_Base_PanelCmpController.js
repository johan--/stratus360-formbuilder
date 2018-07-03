({
    doInit : function(component, event, helper) {
        var JsonData =component.get("v.JsonData");
        if(jsonLogic != undefined && jsonLogic != ''){
            
            //JSLogic Validation
            var validateJson = component.get('v.JsonLogic');
            
            if(validateJson != undefined && validateJson != "" && JsonData != undefined && JsonData != {}) {
                var valid = jsonLogic.apply(validateJson, JsonData);
                if(valid){
                    component.set("v.IsHidden",true);
                    helper.childUpdate(component);
                } else {
                    component.set("v.IsHidden",false);
                    helper.childUpdate(component);
                    //this.toggleErrorMessage(component, valid, component.get('v.FailureValidationMessage'));
                }
            }
        }
    },
	handleOnChange : function(component, event, helper) {
		debugger;

		var params = event.getParams();
		var validate = false;
		var keys = component.get("v.Keys");
		for(var i in keys){
			if(keys[i].label == params.CompId){
				validate = true;
			}
		}
		if(validate){
		var JsonData =component.get("v.JsonData");
		if(jsonLogic != undefined && jsonLogic != ''){

				//JSLogic Validation
				var validateJson = component.get('v.JsonLogic');
				if(validateJson != undefined && validateJson != "" && JsonData != undefined && JsonData != {}) {
						var valid = jsonLogic.apply(validateJson, JsonData);
						if(valid){
							component.set("v.IsHidden",true);
							helper.childUpdate(component);
						} else {
							component.set("v.IsHidden",false);
							helper.childUpdate(component);
						//this.toggleErrorMessage(component, valid, component.get('v.FailureValidationMessage'));
					}
				}
			}
		}
	},
	next : function(component, event, helper) {
		var displayPosition = component.get('v.displayPosition');
        displayPosition++;
        if(displayPosition < component.get('v.body').length){
            component.set('v.displayPosition', displayPosition);
            helper.change(component, helper);
        }
	},

    previous : function(component, event, helper) {
		var displayPosition = component.get('v.displayPosition');
        displayPosition--;
        if(displayPosition >= 0){
            component.set('v.displayPosition', displayPosition);
            helper.change(component, helper);
        }
	},

    onChange : function(component, event, helper) {
        helper.change(component, helper);
	}
})