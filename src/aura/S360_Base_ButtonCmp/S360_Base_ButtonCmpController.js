({
	onClick : function(component, event, helper) {
        var evt = component.getEvent('OnClick');
				//console.log("Payload"+JSON.stringify(component.get('v.CompId')));
        evt.setParams({
            "CompId": component.get('v.CompId'),
            "Payload": component.get('v.Payload')
        });
        evt.fire();
	}
})