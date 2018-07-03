({
	onClick : function(component, event, helper) {
        component.set('v.IsChecked', !component.get('v.IsChecked'));
        component.set('v.Value', !component.get('v.Value'));
        var event = component.getEvent('OnClick');
        event.setParams({
            "CompId": component.get('v.CompId'),
            "Payload": component.get('v.IsChecked')
        });
        event.fire();
        
        // validate required field
        helper.validateRequireField(component);
        // validate field
        helper.validateField(component);
        
        if (component.get("v.BroadcastRender")) {
            var evt2 = $A.get("e.c:S360_Base_renderChange");
            evt2.setParams({
                "CompId": component.get("v.CompId")
            });
            evt2.fire();
        }
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