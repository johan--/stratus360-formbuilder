({
	showToast : function(component, event, helper) {
        //debugger;
		$A.util.removeClass(component.find("ToastID"), "slds-hide");

        if(component.get('v.Type') == 'success'){
            window.setTimeout(
                $A.getCallback(function() {
                    if (component.isValid()) {
                        $A.util.addClass(component.find("ToastID"), "slds-hide");
                    }
                }), 2500
            );   
        }
	},
    
	doInit : function(component, event, helper) {
	},
    
    close : function(component){
        $A.util.addClass(component.find("ToastID"), "slds-hide");
    }
})