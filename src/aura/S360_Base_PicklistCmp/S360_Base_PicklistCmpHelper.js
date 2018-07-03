({
    createJSON : function(component, theValue, theValueFromRecord) {
        
		var options = [];        
		var arrayValue = [];

		if(Array.isArray(theValue))
		{
			arrayValue = theValue;
		}
		else
		{
			arrayValue = theValue.split(',');
		}
        
        if(component.get('v.ShowBlank')){
            options.push({
                "class" : "optionClass",
                "label" : "",
                "value" : null
            });
        }

		for(var i = 0; i < arrayValue.length; i++) 
		{    
	   		var key = '';
	   		var value = '';
		    var keyval = arrayValue[i];
            
            if(keyval){
                keyval = keyval + '';
                if(keyval.indexOf('|') != -1)
                {
                    var kv = keyval.split('|');
                    key = kv[0];
                    value = kv[1];
                }
                else
                {
                    key = keyval;
                    value = keyval;
                }   
            }
            
		    if (theValueFromRecord == value)
		    {
			    options.push({ 
			        "class" : "optionClass",
			        "label" : key,
			        "value" : value,
			        "selected" : "true"
			    });		    	

		    }
		    else
		    {
			    options.push({ 
			        "class" : "optionClass",
			        "label" : key,
			        "value" : value
			    });		    	
		    }


		}
        
        return options;
    },
    stopStartLoading : function(comp, event, helper) {
		var loadingIcon = comp.find("loadingIcon");
		$A.util.toggleClass(loadingIcon, "slds-hide");
	},
	getPicklistOptionsRecordType: function(component, event, helper) {
        // Get controller method to retrieve available Picklist Value
        var action = component.get("c.describe");

        var sobjectType = component.get("v.SObjectName");
        var recordTypeName = component.get("v.RecordTypeName");
        var fieldName = component.get("v.FieldName");

        //Build Field Name List
        var listOfFieldName = [];
        listOfFieldName.push(fieldName);
        
        // Set the parameters
        action.setParams({
            "sobjectType": sobjectType,
            "recordTypeName": recordTypeName,
            "pickListFieldAPINames": listOfFieldName
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var optionsMap = response.getReturnValue();
                var picklistKV = [];
                var Value = component.get("v.Value");

                for (var field in optionsMap) {
                    picklistKV = optionsMap[field];
                    
                }
                //picklistKV.unshift('None');

                var originalPicklistKV = component.get("v.PicklistKV");

                if(originalPicklistKV != "")
                {
                	var arrayValue = originalPicklistKV.split(',');
                	for(var i in arrayValue) 
					{ 
                		picklistKV.push(arrayValue[i]);
                	}
                }

                //Add the PickList value from database to the picklistKV if needed
                component.set("v.PicklistKV",picklistKV);
                
                var opts2 = helper.createJSON(component, picklistKV, Value);
        		component.find("InputSelectId").set("v.options", opts2);
                if(Value){
                	component.find("InputSelectId").set("v.value", Value);
                }else{
                    if(opts2){
                        //component.set("v.Value", opts2[0].value);
                        //component.find("InputSelectId").set("v.value", opts2[0].value);
                        //component.set("v.OldValue", opts2[0].value);
                    }
                }
                helper.onChange(component);
                
        		//Stop spinner
        		helper.stopStartLoading(component, event, helper);
                

            } else if (state === "ERROR") {
                console.error(response);
            }
        });
        $A.enqueueAction(action);
    },
    getPicklistOptionsAll: function(component, event, helper) {
        // Get controller method to retrieve available Picklist Value
        var action = component.get("c.describeAll");

        var sobjectType = component.get("v.SObjectName");
        var fieldName = component.get("v.FieldName");

        //Build Field Name List
        var listOfFieldName = [];
        listOfFieldName.push(fieldName);
        
        // Set the parameters
        action.setParams({
            "sobjectType": sobjectType,
            "pickListFieldAPINames": listOfFieldName
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var optionsMap = response.getReturnValue();
                //debugger;
                var picklistKV = [];
                var newPicklistKV = [];
                var Value = component.get("v.Value");
                
                for (var field in optionsMap) {
                    picklistKV = optionsMap[field];
                }
                //picklistKV.unshift('None');

                //Add Original PickList value if needed
                var originalPicklistKV = component.get("v.PicklistKV");

                if(originalPicklistKV != "")
                {
                	var arrayValue = originalPicklistKV.split(',');
                	for(var i in arrayValue) 
					{ 
                		picklistKV.unshift(arrayValue[i]);
                	}
                }

                //Add the PickList value from database to the picklistKV if needed
                component.set("v.PicklistKV",picklistKV);
				
                var opts2 = helper.createJSON(component, picklistKV, Value);
        		component.find("InputSelectId").set("v.options", opts2);
                if(Value){
                	component.find("InputSelectId").set("v.value", Value);
                }else{
                    if(opts2){
                        //component.find("InputSelectId").set("v.value", opts2[0].value);
                        //component.set("v.Value", opts2[0].value);
                        //component.set("v.OldValue", opts2[0].value);
                    }
                }
                
                helper.onChange(component);
                
        		//Stop spinner
        		helper.stopStartLoading(component, event, helper);
                

            } else if (state === "ERROR") {
                console.error(response);
                console.log(response.getError())
            }
        });
        $A.enqueueAction(action);
    },
    
    onChange : function(component){
        // push to attribute value
        component.set('v.Value', component.find('InputSelectId').get('v.value'));


        // validate required field
        this.validateRequireField(component);
        // validate field
        this.validateField(component);
        
        var evt = component.getEvent('OnChange');
        evt.setParams({
            "CompId": component.get('v.CompId'),
            "Payload": component.find('InputSelectId').get('v.value')
        });
        evt.fire();
    },
    
    handleNotify : function(comp){
        console.log('call ' + comp.get('v.CompId'));
        var self = this;
        setTimeout(function(){
        	var Value = comp.get("v.Value");
            var picklistKV = comp.get("v.PicklistKV");
            
            if(picklistKV == ''){
                self.handleNotify(comp);
            }else{
             	var opts2 = self.createJSON(comp, picklistKV, Value);
            
                comp.find("InputSelectId").set("v.options", opts2);
                comp.find("InputSelectId").set("v.value", Value);

                if(Value != '' && Value != 'null'){
                    self.onChange(comp);
                }
            }    
        }, 100);
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
            "name": component.get('v.CompId'),
            "data": component.get('v.Data')
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