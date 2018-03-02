({
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