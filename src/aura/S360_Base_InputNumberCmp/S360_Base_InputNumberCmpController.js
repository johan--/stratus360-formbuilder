({
    
    doInit: function(component, event, helper){
        helper.setDefaultValue(component);
    },
    
    onValueChange: function(component, event, helper){
        helper.setDefaultValue(component);
        helper.fireChangeEvent(component);
    },
})