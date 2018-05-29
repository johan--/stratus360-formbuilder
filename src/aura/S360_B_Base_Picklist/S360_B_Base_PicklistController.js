({
    doInit: function(component, event, helper) {
        try{
            //Set value to default if provided (DefaultValue and DefaultK are redundant)
            //if(component.get('v.CompId') == "LanguagePicklist");
            if(typeof component.get('v.Value') == 'undefined') component.set('v.Value', '');
            if(typeof component.get('v.DefaultValue') == "undefined") component.set('v.DefaultValue', '');
            if(!component.get('v.DefaultK') && component.get('v.DefaultValue')) component.set('v.DefaultK', component.get('v.DefaultValue'));
            component.set('v.Value', component.get('v.DefaultValue'));
            component.set('v.DefaultK', component.get('v.DefaultValue'));
            //Distinguish and set display label (for french)
            if(component.get('v.PicklistKV')){
                var values = helper.separateKeyValues(component,event,helper).values;
                var displayValues = helper.separateKeyValues(component,event,helper).displayValues;
                try
                {
                    component.set('v.DisplayValue', displayValues[values.indexOf(component.get('v.Value'))]);
                }catch(e)
                {
                    console.log("EXCEPTION in base picklist 2: ", e);
                }
            }

            //GetPicklistValue if not provided
            if(component.get("v.SObjectName")=="")
            {
                // helper.stopStartLoading(component, event, helper);
                var defaultKeyK = component.get("v.DefaultK");
                var picklistKV = component.get("v.PicklistKV");
                // console.log("Init values: ")
                var opts2 = helper.createJSON(picklistKV, defaultKeyK, component.get('v.showBlank'));
                component.find("InputSelectId").set("v.options", opts2);
            }
            else
            {
                if(component.get("v.recordTypeName")==""){
                    //Get all picklist values in the field
                    helper.getPicklistOptionsAll(component, event, helper);
                }
                else{
                    //Get picklist by record type
                    helper.getPicklistOptionsRecordType(component, event, helper);
                }
            }
        }catch(e){
            console.log("EXCEPTION in base picklist: ", e);
        }
    },

    onSelectChangeExpType: function(component, event, helper){
        helper.onChange(component,event,helper);
    },

    handleNotify: function(component, event, helper){
        if(event.getParam('CompId') === component.get('v.CompId') || event.getParam('CompId').indexOf(component.get('v.CompId')) > -1 ){
            var defaultKeyK = component.get("v.DefaultK");
            var picklistKV = component.get("v.PicklistKV");
            var opts2 = helper.createJSON(picklistKV, defaultKeyK);
            component.find("InputSelectId").set("v.options", opts2);
            //helper.onChange(component);
        }
    },

    methodHandleNotify: function(component, event, helper){
        var defaultKeyK = component.get("v.DefaultK");
        var picklistKV = component.get("v.PicklistKV");
        var opts2 = helper.createJSON(picklistKV, defaultKeyK);
        component.find("InputSelectId").set("v.options", opts2);
        //helper.onChange(component);
    },
    
    serverChange: function(component,event,helper){
        //Check if this is type of string, because sometimes it return object type which cause the picklist to error
        if (typeof event.getParam("value") === 'String' || typeof event.getParam("value") === "string") {
            // this is a string 

            component.set('v.Value', event.getParam("value"));

            //Add the PickList value from database to the picklistKV if needed
            var picklistKV = component.get("v.PicklistKV");

            var opts2 = helper.createJSON(picklistKV, component.get('v.Value'), component.get('v.showBlank'));
            component.find("InputSelectId").set("v.options", opts2);
        }
    }
})