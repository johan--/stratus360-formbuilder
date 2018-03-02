({
    doInit: function(component, event, helper) {

        //GetPicklistValue if not provided
        if(component.get("v.SObjectName")=="" || component.get("v.SObjectName")==undefined)
        {
            helper.stopStartLoading(component, event, helper);
            var defaultKeyK = component.get("v.DefaultK");
            component.set("v.OldDefaultK", defaultKeyK);
            var picklistKV = component.get("v.PicklistKV");
            
            var opts2 = helper.createJSON(component, picklistKV, defaultKeyK);
            component.find("InputSelectId").set("v.options", opts2);
            component.find("InputSelectId").set("v.value", defaultKeyK);
            
            helper.onChange(component);
        }
        else
        {
            if(component.get("v.RecordTypeName")=="" || component.get("v.RecordTypeName")==undefined)
            {
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
        /*var evt = component.getEvent('OnChange');
        evt.setParams({
            "CompId": component.get('v.CompId'),
            "Payload": component.find('InputSelectId').get('v.value')
        });
        evt.fire();*/
        helper.onChange(component);
    },
    
    handleNotify: function(component, event, helper){
        if(event.getParam('CompId') === component.get('v.CompId') || event.getParam('CompId').indexOf(component.get('v.CompId')) > -1){
         	
            var defaultKeyK = component.get("v.DefaultK");
            var picklistKV = component.get("v.PicklistKV");
            var opts2 = helper.createJSON(component, picklistKV, defaultKeyK);
            component.find("InputSelectId").set("v.options", opts2);
        	//helper.onChange(component);
        }
    },
    
    methodHandleNotify: function(component, event, helper){
        helper.handleNotify(component);
    },
    
    changeDefaultK : function(component){
        if(component.get('v.DefaultK') == ''){
            component.set('v.DefaultK', component.get('v.OldDefaultK'));
        }
    }
})