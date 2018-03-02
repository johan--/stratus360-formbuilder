({
	doInit: function(component, event, helper){
        helper.setDefaultValue(component);
    },
    
	onValueChange: function(component, event, helper){
        helper.setDefaultValue(component);
        
        var evt = component.getEvent('OnChange');
        evt.setParams({
            "CompId": component.get('v.CompId'),
            "Payload": component.get('v.Value')
        });
        evt.fire();
    },
})