({
    init : function(component, event, helper){
        if(component.get('v.Date') == '' || component.get('v.Date') == undefined){
            debugger;
            if(component.get('v.DefaultDate') != '' && component.get('v.DefaultDate') != undefined){
             	component.set('v.Date', component.get('v.DefaultDate'));   
            }
        }
        
    	component.set('v.InitDate', component.get('v.Date'));
    },
    
	handleOnChange: function(component, event, helper){
        console.log(component.get('v.Date'));debugger;
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