({
	onChange : function(component, event, helper) {
		var evt = component.getEvent('OnChange');
		var payload = [!component.get('v.IsChecked'), component.get('v.Value')];	// [true/false, Salesforce Record Id]

		component.set('v.IsChecked', !component.get('v.IsChecked'));
		component.set('v.ReadOnlyValue', component.get('v.IsReadOnly'));

		evt.setParams({
			"CompId": component.get('v.CompId'),
			"payload": payload
		});
		
		evt.fire();
	},
	
	onClickDelete : function(component, event, helper) {
		console.log("Base change detected");
		var evt = component.getEvent('OnClick');
		var payload = [!component.get('v.IsChecked'), component.get('v.Value')];	// [true/false, Salesforce Record Id]

		component.set('v.IsChecked', !component.get('v.IsChecked'));
		component.set('v.ReadOnlyValue', component.get('v.IsReadOnly'));

		evt.setParams({
			"CompId": component.get('v.CompId'),
			"payload": payload
		});
		
		evt.fire();
	}
})