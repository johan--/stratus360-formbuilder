({
	fireChangeEvent : function(component) {
        var evt = component.getEvent('OnChange');
        evt.setParams({
            "CompId": component.get('v.CompId'),
            "Payload": component.get('v.Value')
        });
        evt.fire();
	},
    
    setDefaultValue : function(component) {
		if(component.get('v.Value') == '' || component.get('v.Value') == undefined)
        {
            if(component.get('v.DefaultValue') != '' && component.get('v.DefaultValue') != undefined)
            {
                component.set('v.Value',component.get('v.DefaultValue'));
            }
        }
	}
})