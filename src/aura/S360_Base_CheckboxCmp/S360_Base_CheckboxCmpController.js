({
	onClick : function(component, event, helper) {
        component.set('v.IsChecked', !component.get('v.IsChecked'));
        
        var event = component.getEvent('OnClick');
        event.setParams({
            "CompId": component.get('v.CompId'),
            "Payload": component.get('v.IsChecked')
        });
        event.fire();
        
	},
})