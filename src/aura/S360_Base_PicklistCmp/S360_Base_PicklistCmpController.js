({
    doInit: function(component, event, helper) {
		//debugger;
        //GetPicklistValue if not provided
        if(component.get("v.SObjectName")=="" || component.get("v.SObjectName")==undefined)
        {
            helper.stopStartLoading(component, event, helper);
            var Value = component.get("v.Value");
            component.set("v.OldValue", Value);
            var picklistKV = component.get("v.PicklistKV");

            var opts2 = helper.createJSON(component, picklistKV, Value);
            component.find("InputSelectId").set("v.options", opts2);
            component.find("InputSelectId").set("v.value", Value);

            if(Value != '' && Value != 'null'){
                helper.onChange(component);
            }
        }
        else
        {
            if(component.get("v.RecordTypeName")=="" || component.get("v.RecordTypeName")==undefined)
            {
                //debugger;
                //Get all picklist values in the field
                helper.getPicklistOptionsAll(component, event, helper);
            }
            else
            {
                //Get picklist by record type
                helper.getPicklistOptionsRecordType(component, event, helper);
            }
        }

    },

    onSelectChangeExpType: function(component, event, helper){
      debugger;
        helper.onChange(component);
        if (component.get("v.BroadcastRender")) {
          var evt2 = $A.get("e.c:S360_Base_renderChange");
          evt2.setParams({
            "CompId": component.get("v.CompId")
          });
          evt2.fire();
        }
    },

    handleNotify: function(component, event, helper){
        if(event.getParam('CompId') === component.get('v.CompId') || event.getParam('CompId').indexOf(component.get('v.CompId')) > -1){

            var Value = component.get("v.Value");
            var picklistKV = component.get("v.PicklistKV");
            var opts2 = helper.createJSON(component, picklistKV, Value);
            component.find("InputSelectId").set("v.options", opts2);
        	//helper.onChange(component);
        }
    },

    methodHandleNotify: function(component, event, helper){
        helper.handleNotify(component);
    },

    changeValue : function(component){
        if(component.get('v.Value') == ''){
            component.set('v.Value', component.get('v.OldValue'));
        }
    },

    handleValidationFail: function(component, event, helper){
        var params = event.getParam('arguments');
        var message = '';
        if (params) {
            message = params.message || component.get('v.FailureValidationMessage');
        }
        helper.toggleErrorMessage(component, false, message);
    },
    handleValidationSuccess: function(component, event, helper) {
      component.set('v.Valid', true);
      component.set('v.Message', "");
    },
})