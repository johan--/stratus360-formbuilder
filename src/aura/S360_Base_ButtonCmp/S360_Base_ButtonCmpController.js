({
	onClick : function(component, event, helper) {
        var evt = component.getEvent('OnClick');
        evt.setParams({
            "CompId": component.get('v.CompId'),
            "Payload": component.get('v.Payload')
        });
        evt.fire();
	}
})