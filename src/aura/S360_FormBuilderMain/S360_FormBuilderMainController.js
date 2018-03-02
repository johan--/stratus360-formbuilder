({
	init : function(component, event, helper) {
        debugger;
        if(component.get('v.FormConfig').S360_FA__Component_Type__c != undefined){
            component.set('v.componentType', component.get('v.FormConfig').S360_FA__Component_Type__c);
            return;
        }
        var action = component.get('c.getComponentConfig');
        action.setParams({
            "formName": component.get('v.formConfigName') ? component.get('v.formConfigName') : (helper.getUrlParam('formname') ? helper.getUrlParam('formname') : ''),
            "recordId": component.get('v.recordId') ? component.get('v.recordId') : (helper.getUrlParam('id') ? helper.getUrlParam('id') : '')
            //"dataId" : component.get('v.dataId') ? component.get('v.dataId') : (helper.getUrlParam('id') ? helper.getUrlParam('id') : '')
        });
        action.setCallback(this, function(response){
            if(component.isValid() && response.getState() == 'SUCCESS'){
                var res = response.getReturnValue();
                
                if(res.status == true){
                    var formConfig = res.formConfig
                    var data = res.data;
                    var fieldInfo = res.fieldInfo;
                    
                    data = helper.populateData(formConfig, data);
                    debugger;
                    component.set('v.Data', data);
                    component.set('v.FieldInfo', fieldInfo);
                    component.set('v.FormConfig', formConfig);
                    component.set('v.componentType', formConfig.S360_FA__Component_Type__c);
                }else{
                    alert(res.message);
                }
            }
        });
        action.setStorable();
        $A.enqueueAction(action);
	},
    
    changeComponentType: function(component, event){
        var formConfig = component.get('v.FormConfig');
        var data = component.get('v.Data');
        var fieldInfo = component.get('v.FieldInfo');
        
        if(formConfig.S360_FA__Component_Type__c == 'Standard'){
            component.find('S360_FormBuilderStandard').setup(formConfig, data, fieldInfo);
        }else if(formConfig.S360_FA__Component_Type__c == 'Custom'){
            component.find('S360_FormBuilderCustom').setup(formConfig, data, fieldInfo);
        }
    },
    
    handleStandardOnClick: function(component, event, helper){
        component.get('v.submittedStandardButton').forEach(function(compId){
            if(compId == event.getParam('CompId')){
                helper.upsert(component);
           		event.stopPropagation();
            }
        });
    },
    
    handleCustomOnClick: function(component, event, helper){
        component.get('v.submittedCustomButton').forEach(function(compId){
            if(compId == event.getParam('CompId')){
                helper.upsert(component);
           		event.stopPropagation();
            }
        });
    },
    
    handleEvent: function(component, event, helper){
        if(event.getParam('action') === 'submit'){
            helper.upsert(component, event.getParam('sender'));
            event.stopPropagation();
        }
    }
})