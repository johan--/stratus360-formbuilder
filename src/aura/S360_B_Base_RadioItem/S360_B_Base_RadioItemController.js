({
    onSelectChange: function(component, event, helper){
    	var evt = component.getEvent('rbOnChange');
        evt.setParams({
            "CompId": component.get('v.CompId'),
            "payload": component.get('v.label')
        });
        evt.fire();
    }
})