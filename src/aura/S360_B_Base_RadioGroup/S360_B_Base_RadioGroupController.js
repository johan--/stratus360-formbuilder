({
	doInit: function(component, event, helper) {
		//Set default value
		
		var radioStages = component.get("v.Stages").length ? component.get("v.Stages") : ["Yes", "No"];
        component.set("v.Stages", radioStages);
	},

	rbOnChange: function(component, event, helper) {
		
		event.stopPropagation();
		//Let onChange event propogate up to parent
		component.set("v.Value", event.getParam("payload"));
		
        console.log('fffx: ' + event.getName());
		console.log('fffx: ' + event.getParam('CompId'));
		console.log('fffx: ' + event.getParam('payload'));

		var evt = component.getEvent('ValueModified');
		evt.setParams({
			"CompId": "RadioGroup",
			"payload": component.get('v.Value')			
		});
		evt.fire();
		
	}
	})