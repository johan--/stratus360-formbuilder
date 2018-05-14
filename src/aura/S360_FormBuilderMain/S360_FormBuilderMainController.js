({
    init : function(component, event, helper) {
        // test incoming input flow
        // console.log(component.get('v.inputFlow'));
        // debugger;
        
        if(component.get('v.FormConfig').S360_FA__Component_Type__c != undefined){
            component.set('v.componentType', component.get('v.FormConfig').S360_FA__Component_Type__c);
            return;
        }
        
        // get availbale flow action
        helper.getAvailableFlowActions(component);
        
        var action = component.get('c.getComponentConfig');
        action.setParams({
            "formName": component.get('v.formConfigName') ? component.get('v.formConfigName') : (helper.getUrlParam('formname') ? helper.getUrlParam('formname') : ''),
            "recordId": component.get('v.recordId') ? component.get('v.recordId') : (helper.getUrlParam('id') ? helper.getUrlParam('id') : '')
            //"dataId" : component.get('v.dataId') ? component.get('v.dataId') : (helper.getUrlParam('id') ? helper.getUrlParam('id') : '')
        });
        action.setCallback(this, function(response){
            if(component.isValid() && response.getState() == 'SUCCESS'){
                var res = response.getReturnValue();
                console.log(res);
                
                if(res.status == true){
                    var formConfig = res.formConfig;
                    var data = res.data;
                    var fieldInfo = {};
                    if(res.fieldInfo){
                        fieldInfo = res.fieldInfo;
                    }
                    debugger;
                    var newForm = helper.recordTypeMap(component, formConfig, data);
                    if (newForm){
                        var action2 = component.get('c.getComponentConfig');
                        action2.setParams({
                            "formName" : newForm,
                            "recordId" : component.get('v.recordId') ? component.get('v.recordId') : (helper.getUrlParam('id') ? helper.getUrlParam('id') : '')
                        });
                        action2.setCallback(this, function(response2){
                            if(component.isValid() && response2.getState() == 'SUCCESS'){
                                var res2 = response2.getReturnValue();
                                if(res2.status == true){
                                    var formConfig2 = res2.formConfig;
                                    var data2 = res2.data;
                                    var fieldInfo2 = {};
                                    if(res2.fieldInfo){
                                        fieldInfo2 = res2.fieldInfo;
                                    }
                                    data = helper.populateData(component, formConfig2, data2);
                                    debugger;
                                    component.set('v.Data', data2);
                                    component.set('v.FieldInfo', fieldInfo2);
                                    component.set('v.FormConfig', formConfig2);
                                    component.set('v.componentType', formConfig2.S360_FA__Component_Type__c);
                                }
                            }
                        });
                        
                        action2.setStorable();
                        $A.enqueueAction(action2);
                        
                    } else {
                        
                        data = helper.populateData(component, formConfig, data);
                        debugger;
                        
                        component.set('v.Data', data);
                        component.set('v.FieldInfo', fieldInfo);
                        component.set('v.FormConfig', formConfig);
                        component.set('v.componentType', formConfig.S360_FA__Component_Type__c);
                    }
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
        // if onclick event came from lightning flow button
        if(event.getParam('Payload') && event.getParam('Payload').action == 'FLOW'){
            
            helper.navigateFlow(component, event);
            
            event.stopPropagation();
            return;
        }
        
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
            debugger;
            helper.upsert(component, event.getParam('sender'));
            event.stopPropagation();
        }
    }
})