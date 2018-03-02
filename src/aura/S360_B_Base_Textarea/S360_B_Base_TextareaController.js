({
    doInit: function(c,e,h){
        
    },
    handleOnChange: function(component, event, helper){
        var evt = component.getEvent('OnChange');
        evt.setParams({
            "CompId": component.get('v.CompId'),
            "payload": component.get('v.Value')
        });
        evt.fire();
    }
})