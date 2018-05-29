({
	init : function(component, event, helper) {
		var action = component.get('c.getComponentConfig');
        action.setParams({
            "formName": component.get('v.formConfigName'),
            "formId": component.get('v.recordId'),
            "dataId" : component.get('v.dataId')
        });
        action.setCallback(this, function(response){
            if(component.isValid() && response.getState() == 'SUCCESS'){
                var res = response.getReturnValue();
                
                if(res.status == true){
                    //debugger;
                    var formConfig = JSON.parse(res.config);
                    component.set('v.Data', res.data);
                    component.set('v.FieldInfo', res.fieldInfo);
                    
                    if(formConfig.components.length != 0){
                        helper.generateForm(component, event, 0, formConfig.components);   
                    }   
                }else{
                    alert(res.message);
                }
            }
        });
        $A.enqueueAction(action);
	},
})