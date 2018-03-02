({
	change : function(component, helper) {
        var displayPosition = component.get('v.displayPosition');
		var body = component.get('v.body');
        
        if(body.length > 0){
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
                console.log(component.get('v.isReady'));
            }
        }
        
        for(var i = 0; i < body.length; i++){
            if(i == displayPosition){
                if(body[i].getElements().length > 0)
                	body[i].getElement().style.display = 'block';
            }else{
                if(body[i].getElements().length > 0)
                	body[i].getElement().style.display = 'none';
            }
        }
	}
})