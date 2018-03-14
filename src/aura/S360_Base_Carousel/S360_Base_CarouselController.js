({
	doInit : function(component, event, helper) {
		helper.doInit(component, event, helper);		
	},
    changePageNumber : function(component, event, helper){
        helper.changePageNumber(component, event, helper);
    },
    prev : function(component, event, helper){
    	var position = component.get('v.position');
    	var list = component.get('v.slidersList');
    	if (list){
    		position--;
    		if(position < 0){
    			position = list.length - 1;
    		}
    		component.set('v.position', position);
    		helper.changePageNumber2(component, event, helper);
    	}
    },
    next : function(component, event, helper){
    	var position = component.get('v.position');
    	var list = component.get('v.slidersList');
    	if (list){
    		position++;
    		if(position == list.length){
    			position = 0;
    		}
    		component.set('v.position', position);
    		helper.changePageNumber2(component, event, helper);
    	}
    },
    
    configureImage : function(component, event, helper){
        return;
        if((event.path[0].naturalWidth / event.path[0].naturalHeight) > 1){
            if(!event.path[0].classList.contains('imageWidth')){
                event.path[0].classList.add('imageWidth');
                event.path[1].style.flexDirection = 'column';
            }
            	
        }else if((event.path[0].naturalWidth / event.path[0].naturalHeight) < 1){
            if(!event.path[0].classList.contains('imageHeight')){
                event.path[0].classList.add('imageHeight');
            	event.path[1].style.flexDirection = 'row';
            }	
        }else{
            if(event.path[0].style.height != '100%'){
            	event.path[0].style.height="100%";
            	event.path[1].style.flexDirection = 'row';    
            }
            
        }
    }
    
})