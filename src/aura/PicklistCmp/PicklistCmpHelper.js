({
    createJSON : function(theValue, theValueFromRecord) {
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



        for(var i in arrayValue)
        {
            var key = '';
            var value = '';
            var keyval = arrayValue[i];

            if(keyval){
                if(keyval.search('|') != 0) // i use chrome, i don't know why but using search if '|' doesnt exists return 0 not -1 but not the others
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

            if (theValueFromRecord == key)
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
                helper.stopStartLoading(component, event, helper);


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
                helper.stopStartLoading(component, event, helper);


            } else if (state === "ERROR") {
                console.error(response);
            }
        });
        $A.enqueueAction(action);
    },

    onChange : function(component){
        var evt = component.getEvent('OnChange');
        evt.setParams({
            "CompId": component.get('v.CompId'),
            "payload": component.find('InputSelectId').get('v.value')
        });
        evt.fire();
    }

})