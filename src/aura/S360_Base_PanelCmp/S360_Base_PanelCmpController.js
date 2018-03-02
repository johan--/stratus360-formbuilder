({
	next : function(component, event, helper) {
		var displayPosition = component.get('v.displayPosition');
        displayPosition++;
        if(displayPosition < component.get('v.body').length){
            component.set('v.displayPosition', displayPosition);
            helper.change(component, helper);
        }
	},
    
    previous : function(component, event, helper) {
		var displayPosition = component.get('v.displayPosition');
        displayPosition--;
        if(displayPosition >= 0){
            component.set('v.displayPosition', displayPosition);
            helper.change(component, helper);
        }
	},
    
    onChange : function(component, event, helper) {
        helper.change(component, helper);
	}
})