({
	initialize : function(component, event, helper) {
		var fieldName = component.get("v.HeaderFields");
		var recordVal = component.get("v.Item");
		var val = [];

		if(recordVal != "") {
			//component.set("v.CompId", recordVal[fieldName[0]]);
			component.set("v.Value", recordVal[fieldName[0]]);

			for (var i=1; i<fieldName.length; i++)
				val.push(recordVal[fieldName[i]]);

			//component.set('v.HeaderFields', component.get('v.HeaderFields').shift());
			component.set("v.ItemFields", val);
		}
	},

	_handleOnClick : function(component, evt, helper) {
		
	},

	_handleOnChange : function(component, event, helper) {

	},

    _handleOnTextClick : function(component, evt, helper) {
		
		var evt = component.getEvent('OnTextClick');
        var payload ="";
		evt.setParams({
			"CompId": component.get('v.CompId'),
			"payload": component.get('v.Item')
		});
		
		evt.fire();
	},
})