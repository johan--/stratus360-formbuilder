({
    afterScriptLoaded: function(component, event, helper){
		
    },
    
	setup : function(component, event, helper) {
		var params = event.getParam('arguments');
        if (params) {
            // setup the css
            component.set('v.cssResource', $A.get('$Resource.' + params.config.Custom_Css__c) + '/router.css');
            
            // setup the scipt
            component.set('v.scriptResource', $A.get('$Resource.' + params.config.Custom_Script__c) + '/router.js');
            
            component.set('v.FormConfig', params.config);
            component.set('v.Data', params.data);
            component.set('v.FieldInfo', params.fieldInfo);
            
            var configComponents = JSON.parse(params.config.JSON__c).components;
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
    
    /**
     * this method is called after S360_FormBuilderMain finish its server operation
     * basically, this method has effect only if we trigger the submit event from custom action
     */
    handleAfterSubmit: function(component, event, helper){        
        
        var params = event.getParam('arguments');
        if(params){
            // check response status, if error or incomplete, throw it
            if(params.status == 'ERROR' || params.status == 'INCOMPLETE'){
                alert(params.message);
                //helper.showToast(component, 'error', params.message);
                return;
            }else{
                alert(params.message);
                //helper.showToast(component, 'success', params.message);
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
    }
})