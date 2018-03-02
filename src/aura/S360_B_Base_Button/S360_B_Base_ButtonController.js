({
	onClick : function(component, event, helper) {
		var evt = component.getEvent('OnClick');
		evt.setParams({
			"CompId": component.get('v.CompId'),
			"payload": component.get('v.payload')
		});
		
		evt.fire();
	}
})