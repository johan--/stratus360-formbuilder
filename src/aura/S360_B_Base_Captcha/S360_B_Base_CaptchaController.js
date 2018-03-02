({
	initialize : function(component, event, helper) {
        // handle message sent from visualforce
        var vfOrigin = $A.get('$Label.c.S360_base_captcha_domain');
        
        window.addEventListener("message", function(response) {
            if (response.origin !== vfOrigin) {
                // Not the expected origin: Reject the message!
                //return;
            }
            
            if(response.data.action == 'responseCAPTCHA' && response.data.status == true){
                component.getEvent('OnCaptcha').setParams({CompId: component.get('v.CompId'), Status: true}).fire();
            }else if(response.data.action == 'responseCAPTCHA' && response.data.status == false){
                component.getEvent('OnCaptcha').setParams({CompId: component.get('v.CompId'), Status: false}).fire();
            }else if(response.data.action == 'openOptionsCAPTCHA'){
                component.find("vfFrame").getElement().style.height = '500px';
            }else if(response.data.action == 'closeOptionsCAPTCHA'){
                component.find("vfFrame").getElement().style.height = '58px';
            }
            
        }, false);
	},
    
    frameLoaded: function(component, event){
        component.find('loading').getElement().style.display = 'none';
    }
})