({
    //createJSON(picklistKV, defaultKeyK, component.get('v.showBlank')
    createJSON : function(theValue, theValueFromRecord, showBlank) {
        var options = [];
        var arrayValue = [];
        
        if(theValue == null)
        {
            return null
        }else{
            if(Array.isArray(theValue))
            {
                arrayValue = theValue;
            }
            else
            {
                arrayValue = theValue.split(',');
            }
            
            //add a blank value if one is required for this picklist
            if(!theValueFromRecord == "" && showBlank){
                options.push({
                    "class" : "optionClass",
                    "label" : "",
                    "value" : ""
                });
            }

            if(theValueFromRecord == "" || typeof theValueFromRecord == 'undefined'){
                options.push({
                    "class" : "optionClass",
                    "label" : label,
                    "value" : key,
                    "selected" : "true"
                });
            }


            for(var i = 0; i < arrayValue.length; i++) 
            {
                var key = '';
                var label = '';
                var keyval = arrayValue[i];
                if(keyval){
                    keyval = keyval + '';
                    if(keyval.indexOf('|') > 0) // i use chrome, i don't know why but using search if '|' doesnt exists return 0 not -1 but not the others
                    {
                        var kv = keyval.split('|');
                        key = kv[0];
                        label = kv[1];
                    }
                    else
                    {
                        key = keyval;
                        label = keyval;
                    }
                }

                if (theValueFromRecord == key || theValueFromRecord == label)
                {
                    options.push({
                        "class" : "optionClass",
                        "label" : label,
                        "value" : key,
                        "selected" : "true"
                    });

                }
                else
                {
                    options.push({
                        "class" : "optionClass",
                        "label" : label,
                        "value" : key
                    });
                }


            }

            return options;
        }
    },
    // stopStartLoading : function(comp, event, helper) {
    //     var loadingIcon = comp.find("loadingIcon");
    //     $A.util.toggleClass(loadingIcon, "slds-hide");
    // },
    getPicklistOptionsRecordType: function(component, event, helper) {
        // Get controller method to retrieve available Picklist Value
        var action = component.get("c.describe");

        var sobjectType = component.get("v.SObjectName");
        var recordTypeName = component.get("v.recordTypeName");
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
                var defaultKeyK = component.get("v.DefaultK");

                for (var field in optionsMap) {
                    picklistKV = optionsMap[field];

                }

                    // for(var i = 0 ; i > optionsMap.length ; i++) {
                    //     picklistKV = optionsMap[i]
                    // }

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


                var opts2 = helper.createJSON(picklistKV, defaultKeyK);
                component.find("InputSelectId").set("v.options", opts2);
                //Stop spinner
                // helper.stopStartLoading(component, event, helper);


            } else if (state === "ERROR") {
                console.error(response);
            }
        });
        $A.enqueueAction(action);
    },
    getPicklistOptionsAll: function(component, event, helper) {
        // Get controller method to retrieve available Picklist Value
        // console.log("component.get: "+component.get("c.describeAll"));
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
                var picklistKV = [];
                var newPicklistKV = [];
                var defaultKeyK = component.get("v.DefaultK");

                for (var field in optionsMap) {
                    picklistKV = optionsMap[field];

                }

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

                var opts2 = helper.createJSON(picklistKV, defaultKeyK);
                component.find("InputSelectId").set("v.options", opts2);
                //Stop spinner
                // helper.stopStartLoading(component, event, helper);


            } else if (state === "ERROR") {
                console.error(response);
            }
        }); 
        $A.enqueueAction(action);
    },

    onChange : function(component, event, helper){
        var values;
        var displayValues;

        // Separate field value from display value (for french)
        
        //Jackie's code - just changed the variables from ES6 to ES5
        values =  this.separateKeyValues(component,event,helper).values,
        displayValues = this.separateKeyValues(component,event,helper).displayValues

        //old ES6 code - not compatible with Internet Explorer
        // [values, displayValues] = [
        //     helper.separateKeyValues(component,event,helper).values,
        //     helper.separateKeyValues(component,event,helper).displayValues
        // ];

        

        //Set the value and the display value separately
        var evt = component.getEvent('OnChange');
        var payload = component.find('InputSelectId').get('v.value').trim()

        evt.setParams({
            "CompId": component.get('v.CompId'),
            "payload": payload
        });
        
        component.set('v.DisplayValue', displayValues[values.indexOf(payload)]);
        component.set("v.Value", payload);

        // console.log(evt.getParams().payload);
        evt.fire();
    },

    separateKeyValues : function(c,e,h){
        // Distinguish value from display label (for french)
        var options = c.get('v.PicklistKV').split(',');
        var values = [];
        var displayValues = [];

        for(var i = 0; i < options.length; i++){
            if(options[i].indexOf('|') > 0 )
            {

                values[i] = options[i].match(/([^\|]*)\|/)[1].trim();
                displayValues[i] = options[i].match(/\|([^\|]*)/)[1].trim();
            }else{
                values[i] = options[i].trim();
                displayValues[i] = options[i].trim();
            }
        }

        return {
            values: values,
            displayValues: displayValues
        }
    }

})