({
    init : function(component, event, helper){
        if(component.get('v.Date') == '' || component.get('v.Date') == undefined){
            component.set('v.Date', component.get('v.DefaultDate'));
        }
    	component.set('v.InitDate', component.get('v.Date'));
    },
    
	handleOnChange: function(component, event, helper){
        if(component.get('v.Date') != component.get('v.InitDate')){
         	var evt = component.getEvent('OnChange');
            evt.setParams({
                "CompId": component.get('v.CompId'),
                "Payload": component.get('v.Date')
            });
            evt.fire();
            
            component.set('v.InitDate', component.get('v.Date'));
        }
    }
})