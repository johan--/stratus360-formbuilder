({
    init : function(component, event, helper) {
        // test incoming input flow
        // console.log(component.get('v.inputFlow'));
        // //debugger;
        debugger;
        if(component.get('v.FormConfig').S360_FA__Component_Type__c != undefined){
            component.set('v.componentType', component.get('v.FormConfig').S360_FA__Component_Type__c);
            return;
        }

        // get availbale flow action
        helper.getAvailableFlowActions(component);

        var action = component.get('c.getComponentConfig');
        action.setParams({
            "formName": component.get('v.formConfigName') ? component.get('v.formConfigName') : (helper.getUrlParam('formname') ? helper.getUrlParam('formname') : ''),
            "recordId": component.get('v.recordId') ? component.get('v.recordId') : (helper.getUrlParam('id') ? helper.getUrlParam('id') : ''),
            "language": component.get('v.language')
            //"dataId" : component.get('v.dataId') ? component.get('v.dataId') : (helper.getUrlParam('id') ? helper.getUrlParam('id') : '')
        });
        action.setCallback(this, function(response){
            if(component.isValid() && response.getState() == 'SUCCESS'){
                var res = response.getReturnValue();
                console.log(res);

                if(res.status == true){
                  debugger;
                    var formConfig = res.formConfig;
                    var data;

                    if(formConfig.S360_FA__Save_to_Storage__c && res.data){
                        data = JSON.parse(res.data.S360_FA__Record__c);
                        data.Id = res.data.Id;
                    }else{
                        data = res.data;
                    }

                    var fieldInfo = {};
                    var objectInfo = {};

                    if(res.fieldInfo){
                        fieldInfo = res.fieldInfo;
                    }

                    if(res.objectInfo){
                        objectInfo = res.objectInfo;
                    }

                    var newForm = helper.recordTypeMap(component, formConfig, data);
                    if (newForm){
                        var action2 = component.get('c.getComponentConfig');
                        action2.setParams({
                            "formName" : newForm,
                            "recordId" : component.get('v.recordId') ? component.get('v.recordId') : (helper.getUrlParam('id') ? helper.getUrlParam('id') : '')
                        });
                        action2.setCallback(this, function(response2){
                            if(component.isValid() && response2.getState() == 'SUCCESS'){
                              debugger;
                                var res2 = response2.getReturnValue();
                                if(res2.status == true){
                                    var formConfig2 = res2.formConfig;
                                    var data2;

                                    if(formConfig2.S360_FA__Save_to_Storage__c){
                                        data2 = JSON.parse(res2.data.S360_FA__Record__c);
                                    }else{
                                        data2 = res2.data;
                                    }

                                    var fieldInfo2 = {};
                                    var objectInfo2 = {};

                                    if(res2.fieldInfo){
                                        fieldInfo2 = res2.fieldInfo;
                                    }

                                    if(res2.objectInfo){
                                        objectInfo2 = res2.objectInfo;
                                    }

                                    data = helper.populateData(component, formConfig2, data2);
                                    component.set('v.lockLogic', formConfig2.S360_FA__Lock_Logic__c);
                                    component.set('v.Data', data2);
                                    component.set('v.FieldInfo', fieldInfo2);
                                    component.set('v.ObjectInfo', objectInfo2);
                                    component.set('v.FormConfig', formConfig2);
                                    component.set('v.componentType', formConfig2.S360_FA__Component_Type__c);
                                    debugger;
                                    component.set('v.Standard', component.find('S360_FormBuilderStandard'));
                                    component.set('v.autoSaveInterval', formConfig2.S360_FA__AutoSave_Record_Interval__c);
                                    component.set('v.autoSaveOn', formConfig2.S360_FA__AutoSave_Record__c);

                                    helper.autoSave(component);
                                }
                            }
                        });

                        action2.setStorable();
                        $A.enqueueAction(action2);

                    } else {

                        data = helper.populateData(component, formConfig, data);
                        //debugger;
                        component.set('v.lockLogic', formConfig.S360_FA__Lock_Logic__c);
                        component.set('v.Data', data);
                        component.set('v.FieldInfo', fieldInfo);
                        component.set('v.ObjectInfo', objectInfo);
                        component.set('v.FormConfig', formConfig);
                        debugger;

                        component.set('v.componentType', formConfig.S360_FA__Component_Type__c);
                        component.set('v.Standard', component.find('S360_FormBuilderStandard').get("v.value"));
                        // console.log("TST");
                        // var value = component.get("v.Standard").get("v.value");
                        // console.log(value);
                        // console.log(JSON.stringify(value));
                        debugger;
                        component.set('v.autoSaveInterval', formConfig.S360_FA__AutoSave_Record_Interval__c);
                        component.set('v.autoSaveOn', formConfig.S360_FA__AutoSave_Record__c);

                        console.log(formConfig.S360_FA__Lock_Logic__c);
                        helper.autoSave(component);
                    }
                }else{
                    alert(res.message);

                    /*var formConfig = res.formConfig;
                    component.set('v.componentType', formConfig.S360_FA__Component_Type__c);

                    if(formConfig.S360_FA__Component_Type__c == 'Standard'){
                        component.find('S360_FormBuilderStandard').showToastMethod('error', res.message);
                    }else if(formConfig.S360_FA__Component_Type__c == 'Custom'){
                        alert(res.message);
                    }*/
                }
            }
        });
        action.setStorable();
        $A.enqueueAction(action);
    },

    changeComponentType: function(component, event){
        debugger;
        var formConfig = component.get('v.FormConfig');
        var data = component.get('v.Data');
        var fieldInfo = component.get('v.FieldInfo');
        var objectInfo = component.get('v.ObjectInfo');
        var valid = false;
        if(component.get("v.lockLogic") && component.get("v.lockLogic")!= ""){
          var valid = jsonLogic.apply(JSON.parse(component.get("v.lockLogic")), data);
        }
        console.log ("JSON : " + JSON.stringify(valid));
        if(formConfig.S360_FA__Component_Type__c == 'Standard'){
            component.find('S360_FormBuilderStandard').setup(formConfig, data, fieldInfo, objectInfo, valid);
        }else if(formConfig.S360_FA__Component_Type__c == 'Custom'){
            component.find('S360_FormBuilderCustom').setup(formConfig, data, fieldInfo, undefined, valid);
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
            //debugger;
            helper.upsert(component, event.getParam('sender'));
            event.stopPropagation();
        }
    },

    changeLang: function(component, event, helper){
      debugger;
      var fconfig = component.get('v.FormConfig');
      fconfig.S360_FA__Component_Type__c = undefined;
      component.set('v.FormConfig', {});

      component.set('v.componentType', undefined);

      var lang = event.getSource().get("v.value");
      component.set("v.language", lang);
      var init = component.get('c.init');
      $A.enqueueAction(init);
    },
    
    jsonLogicLibrary: function(component){
        if(jsonLogic != undefined && jsonLogic != ''){
            jsonLogic.add_operation("Math", Math);
        }
    }

    // autoSave: function(component, event, helper){
    //   if(component.get("v.autoSaveOn")){
    //       setInterval(function(){
    //           helper.upsert();
    //       }, 1000 * component.get("v.autoSaveInterval"));
    //   }
    // }
})