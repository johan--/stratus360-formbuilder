({
	init : function(component, event, helper) {
        setTimeout(function(){
            component.set('v.payload', new Date().getTime() + '');
        }, 500);
	},
    
    clicked: function(component, event){
        component.set('v.value', event.getParam('Payload'))
    }
})