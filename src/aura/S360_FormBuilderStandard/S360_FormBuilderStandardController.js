({
    afterScriptLoaded: function(component, event, helper){
        //This will load the toast component if true
        //the logic will prevent the unneccessary flashing component
        component.set('v.cssLoaded',true);
        debugger;
    },

	setup : function(component, event, helper) {
		var params = event.getParam('arguments');
        if (params) {
            debugger;
            component.set('v.FormConfig', params.config);
            component.set('v.Data', params.data);
            component.set('v.FieldInfo', params.fieldInfo);
            
            var configComponents = JSON.parse(params.config.S360_FA__JSON__c).components;
            if(configComponents.length != 0){
                helper.generateForm(component, event, configComponents);   
            } 
        }
	},
    
    /**
     * if action type equals to submit, it will bubble up to S360_FormBuilderMain2.
     * this is not same with custom action with submit event
     */
    handleButtonClick: function(component, event, helper){
       	var actionButton = component.get('v.actionButton');
        if(actionButton == undefined){
            return;
        }
        var evt = actionButton[event.getParam('CompId')];
        if(evt != undefined){
            //stop bubble event
            event.stopPropagation();
            
            if(evt.actionType === 'event'){
                helper.eventHandler(component, event.getParam('CompId'), evt.actionName, evt.actionTarget, undefined);
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
        if(params){
            // check response status, if error or incomplete, throw it
            if(params.status == 'ERROR' || params.status == 'INCOMPLETE'){
                helper.showToast(component, 'error', params.message);
                return;
            }else{
                helper.showToast(component, 'success', params.message);
            }
            
            // if actionButton undefined, it's mean no button defined
            var actionButton = component.get('v.actionButton');
            debugger;
            if(actionButton == undefined){
                return;
            }
            
            // only custom action submit that can handle server response
            var evt = actionButton[params.sender];
            debugger;
            if(evt != undefined){
                if(evt.actionType === 'custom'){
                    helper.customEventHandler(component, params.sender, evt.action, {
                        type: 'submit',
                        status: params.status
                    });
                }
            }
        }
    }
})