({
    afterScriptLoaded: function(component, event, helper){
        //This will load the toast component if true
        //the logic will prevent the unneccessary flashing component
        component.set('v.cssLoaded',true);
        
    },

	setup : function(component, event, helper) {
		var params = event.getParam('arguments');
        if (params) {
            
            component.set('v.FormConfig', params.config);
            component.set('v.Data', params.data);
            component.set('v.FieldInfo', params.fieldInfo);
            component.set('v.ObjectInfo', params.objectInfo);
            debugger;
            
            if(params.config.S360_FA__JSON__c != '' && params.config.S360_FA__JSON__c != undefined){
             	var configComponents = JSON.parse(params.config.S360_FA__JSON__c).components;
                debugger;
                if(configComponents.length != 0){
                    helper.generateForm(component, event, configComponents);   
                }    
            }
        }
	},
    
    /**
     * if action type equals to submit, it will bubble up to S360_FormBuilderMain.
     * this is not same with custom action with submit event
     */
    
    
    handleButtonClick: function(component, event, helper){
        
       	var actionButton = component.get('v.actionButton');
        
        if(event.getParam('Payload') != undefined && event.getParam('Payload').action != 'FLOW'){
            if(actionButton==undefined){
                actionButton = {}
            }
        	actionButton[event.getParam('CompId')] = event.getParam('Payload');
            component.set('v.actionButton', actionButton);
        }else if (actionButton==undefined){
            return;
        }
        
        
        var evt = actionButton[event.getParam('CompId')];
        if(evt != undefined){
            //stop bubble event
            event.stopPropagation();
            
            if(evt.actionType === 'event'){
                if(evt.actionName === 'redirect'){
                    helper.eventHandler(component, event.getParam('CompId'), evt.actionName, evt.actionUri, evt.actionTarget);
                }else{
                	helper.eventHandler(component, event.getParam('CompId'), evt.actionName, evt.actionTarget, undefined);    
                }
                
            }else if(evt.actionType === 'custom'){
                
                helper.customEventHandler(component, event.getParam('CompId'), evt.action);
            }
        }
    },
    
    handleCaptcha: function(component, event, helper){
      	component.set('v.isCaptchaSuccess', event.getParam('Status'));
    },
    
    /**
     * this method is called after S360_FormBuilderMain finish its server operation
     * basically, this method has effect only if we trigger the submit event from custom action
     */
    handleAfterSubmit: function(component, event, helper){
        var params = event.getParam('arguments');
        debugger;
        if(params){
            // check response status, if error or incomplete, throw it
            if(params.status == 'ERROR'){
                if(component.get('v.configMapping')[params.sender] && component.get('v.configMapping')[params.sender].errorMessage){
                	helper.showToast(component, 'error', component.get('v.configMapping')[params.sender].errorMessage);    
                }else{
                    helper.showToast(component, 'error', params.message);
                }
            }else if(params.status == 'INCOMPLETE'){
                helper.showToast(component, 'warning', params.message);
            }else{
                if(component.get('v.configMapping')[params.sender] && component.get('v.configMapping')[params.sender].successMessage){
                	helper.showToast(component, 'success', component.get('v.configMapping')[params.sender].successMessage);    
                }else{
                    helper.showToast(component, 'success', params.message);
                    debugger;
                }
            }
            
            // if actionButton undefined, it's mean no button defined
            var actionButton = component.get('v.actionButton');
            
            if(actionButton == undefined){
                return;
            }
            
            // only custom action submit that can handle server response
            var evt = actionButton[params.sender];
            
            if(evt != undefined){
                if(evt.actionType === 'custom'){
                    helper.customEventHandler(component, params.sender, evt.action, {
                        type: 'submit',
                        status: params.status
                    });
                }
            }
        }
    },
    
    handleLookupSObjectUpdateEvt : function(component, event, helper){
        var field = event.getParam('instanceId');
        var refField = field.substr(0, field.lastIndexOf("__c")) + '__r';
        var data = component.get('v.Data');
        
        console.log(event.getParams());
        data[field] = event.getParam('sObjectId');
        data[refField] = event.getParam('payload');
        
        component.set('v.Data', data);
    },
    
    handleSObjectClear : function(component, event, helper){
        var field = event.getParam('instanceId');
        var refField = field.substr(0, field.lastIndexOf("__c")) + '__r';
        var data = component.get('v.Data');
        
        data[field] = '';
        data[refField] = '';
        
        component.set('v.Data', data);
    },
    
    handleShowToast : function(component, event, helper){
        helper.showToast(component, event.getParam('type'), event.getParam('message'));
    },
    
    handleRefreshOutputFlowValue: function(component, event, helper){
        helper.refreshRealOutputFlowVal(component);
    }
})