({
	init : function(component, event, helper) {
		var availableFlowActions = component.get('v.availableFlowAction');
        if(availableFlowActions){
            for(var i = 0; i < availableFlowActions.length; i++){
                if (availableFlowActions[i] == "PAUSE") {
                    component.set("v.canPause", true);
                } else if (availableFlowActions[i] == "BACK") {
                    component.set("v.canBack", true);
                } else if (availableFlowActions[i] == "NEXT") {
                    component.set("v.canNext", true);
                } else if (availableFlowActions[i] == "FINISH") {
                    component.set("v.canFinish", true);
                }
            }
        }
	},
    
    onButtonPressed : function(component, event, helper){
        var evt = component.getEvent('OnClick');
        evt.setParams({
            "CompId": component.get('v.CompId'),
            "Payload": {
                action: 'FLOW',
                payload: event.getSource().getLocalId()
            }
        });
        evt.fire();
    }
})