({
	doInit : function(component, event, helper) {
		var type = component.get('v.type');
		switch(type){
			case 'red':
				component.set('v.class', 'alert-danger');
				break;
			case 'yellow':
				component.set('v.class', 'alert-warning');
				break;
			case 'green':
				component.set('v.class', 'alert-success');
				break;
			case 'blue':
				component.set('v.class', 'alert-info');
				break;
			default: 
				component.set('v.class', 'alert-info');
				break;
		}
		setTimeout(function() {helper._showSelf(component,event,helper)}, 500);
		setTimeout(function() {helper._hideSelf(component, event, helper)}, 3000);

	},
	_invoke : function(component, event, helper) {
		//Red/yellow remain until user dismisses. Blue/green will disappear after 2.5s
		if(component.get('v.switch')){
			var type = component.get('v.type');

			switch(type){
				case 'red':
					component.set('v.class', 'alert-danger');
					setTimeout(function() {helper._showSelf(component,event,helper)}, 500);
					break;

				case 'yellow':
					component.set('v.class', 'alert-warning');
					setTimeout(function() {helper._showSelf(component,event,helper)}, 500);
					break;

				case 'green':
					component.set('v.class', 'alert-success');
					setTimeout(function() {helper._showSelf(component,event,helper)}, 500);
					setTimeout(function() {helper._hideSelf(component, event, helper)}, 3000);
					break;

				default: 
					//blue
					component.set('v.class', 'alert-info');
					setTimeout(function() {helper._showSelf(component,event,helper)}, 500);
					setTimeout(function() {helper._hideSelf(component, event, helper)}, 1000);
					break;
					
			}
		}
	},
	_hideSelf : function(cmp, evt, helper){
		helper._hideSelf(cmp, evt, helper);
	}
})