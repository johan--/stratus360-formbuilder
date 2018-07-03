({
    init : function(component, event, helper){
        if(component.get('v.Value') == '' || component.get('v.Value') == undefined){
            if(component.get('v.DefaultValue') != '' && component.get('v.DefaultValue') != undefined){
             	component.set('v.Value', component.get('v.DefaultValue'));
            }
        }
    },

    handleValidationFail: function(component, event, helper) {
        debugger;
        var params = event.getParam('arguments');
        var message = '';
        if (params) {
            message = params.message || component.get('v.FailureValidationMessage');
        }
        component.set('v.Valid', false);
        component.set('v.Message', message);
    },
    
    handleValidationSuccess: function(component, event, helper) {
        component.set('v.Valid', true);
        component.set('v.Message', "");
    },
    
    handleOnChange: function(component, event, helper){
        console.log(component.get('v.Value'));
        var evt = component.getEvent('OnChange');
        evt.setParams({
            "CompId": component.get('v.CompId'),
            "Payload": component.get('v.Value')
        });
        evt.fire();
        
        // validate required field
        helper.validateRequireField(component);
        // validate field
        //helper.validateField(component);
    },
})