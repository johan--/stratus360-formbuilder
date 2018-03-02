({
    doInit: function(component,event,helper){
		helper.setDefaultValue(component);
    },
    
    handleOnChange: function(component, event, helper){
        event.stopPropagation();
        var evt = component.getEvent('OnChange');
        evt.setParams({
            "CompId": component.get('v.CompId'),
            "payload": component.get('v.Value')
        });
        evt.fire();
    },
    itemsChange: function(component, event, helper){
        if(component.get('v.IsDisabled')) component.set('v.Value', ''); //move this to the end if it is causing problems with redtext
        if(component.get('v.Value') != '' && component.get('v.Value') != undefined){
            component.set('v.IsMissingValueLocal',false);
        }
        else{
            component.set('v.IsMissingValueLocal', true);
        }
    },
})