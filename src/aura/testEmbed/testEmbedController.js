({
	onClick: function(component, event, helper) {
		var evt = component.getEvent('OnClick');
		evt.setParams({
			"CompId": "xxx",
            "Payload":{actionType: 'custom', action: 'submit()'},
            
		});
		
		evt.fire();
	}
})