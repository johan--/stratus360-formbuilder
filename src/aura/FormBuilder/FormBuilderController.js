({
	init : function(component, event, helper) {
		var action = component.get('c.getComponentConfig');
        action.setParams({
            "formName": component.get('v.formConfigID'),
            "formId" : component.get('v.recordId')
        });
        action.setCallback(this, function(response){
            if(component.isValid() && response.getState() == 'SUCCESS'){
                var formConfig = JSON.parse(response.getReturnValue());
                if(formConfig.components.length != 0){
                 	helper.generateForm(component, event, 0, formConfig.components);   
                }
            }
        });
        $A.enqueueAction(action);
	}
})