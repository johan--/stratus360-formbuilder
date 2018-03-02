({
	change : function(component, helper) {
        var displayPosition = component.get('v.displayPosition');
		var body = component.get('v.body');
        
        /*if(body.length > 0){
            if(body[0].getElements().length == 0){
                setTimeout(function(){
                    var counter = component.get('v.counter');
                    if(!counter){
                        counter = 0;
                    }
                    counter++;
                    component.set('v.counter', counter);
                }, 1000);
            }else{
                component.set('v.isReady', true);
            }
        }*/
        
        var count = 0;
        for(var i = 0; i < body.length; i++){
            if(body[i] == undefined){
                break;
            }
            
            if(body[i].getElements().length != 0){
                count++;
            }else{
                break;
            }
            
            if(i == displayPosition){
                $A.util.addClass(body[i], 'slds-show');
                $A.util.removeClass(body[i], 'slds-hide');
            }else{
                
                $A.util.addClass(body[i], 'slds-hide');
                $A.util.removeClass(body[i], 'slds-show');
            }
        }
        if(count != body.length){
            setTimeout(function(){
                var counter = component.get('v.counter');
                if(!counter){
                    counter = 0;
                }
                counter++;
                component.set('v.counter', counter);
            }, 1000);
        }else{
            component.set('v.isReady', true);
        }
	}
})