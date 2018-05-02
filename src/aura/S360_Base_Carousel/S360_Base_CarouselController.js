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
    },
    
    thumbnailLoaded: function(component, event, helper){
        if(helper.isIE() != false){
            component.find('carouselThumbnailsScroller').getElement().style.width = (component.get('v.slidersList').length * component.get('v.thumbnailScrollSize')) + 'px';
        }
        
        helper.thumbnailControllButtonManager(component);
        window.onresize = function(){
            component.find('carouselThumbnailsScroller').getElement().style.transform = 'translateX('+ 0 +'px)';
            component.set('v.thumbnailScrollPos', 0);
            helper.thumbnailControllButtonManager(component);
        }
    },
    
    prevThumbnailButton: function(component, event, helper){
        var thumbnailScroller = component.find('carouselThumbnailsScroller').getElement();
        var thumbnailParent = component.find('carouselThumbnailsContainer').getElement();
        var scrollSize = component.get('v.thumbnailScrollSize');
        var size = component.get('v.thumbnailScrollPos');
        
        var scrollWidth = 0;
        
        // if IE
        if(helper.isIE() != false){
            scrollWidth = component.get('v.slidersList').length * scrollSize;
        }else{
            scrollWidth = thumbnailScroller.scrollWidth;
        }
        
        
        if(scrollWidth - Math.abs(size + (scrollSize * -1)) - thumbnailParent.offsetWidth > 0){
        	size = size + (scrollSize * -1);    
            
        }else{
            if(scrollWidth - size - thumbnailParent.offsetWidth != 0){
                size = size + ((scrollWidth - Math.abs(size) - thumbnailParent.offsetWidth) * -1);    
                
            }else{
            	return;    
            }
            
        }
        
        thumbnailScroller.style.transform = 'translateX('+ size +'px)';
        component.set('v.thumbnailScrollPos', size);
        
        helper.thumbnailControllButtonManager(component);
    },
    
    nextThumbnailButton: function(component, event, helper){
        var thumbnailScroller = component.find('carouselThumbnailsScroller').getElement();
        var thumbnailParent = component.find('carouselThumbnailsContainer').getElement();
        var scrollSize = component.get('v.thumbnailScrollSize');
        var size = component.get('v.thumbnailScrollPos');
        
        if(Math.abs(size) - scrollSize >= 0){
            size = size + scrollSize;
        }else{
            if(scrollSize - Math.abs(size) != 0){
                size += Math.abs(size);
            }else{
                return;
            }
        }
        
        thumbnailScroller.style.transform = 'translateX('+ size +'px)';
        component.set('v.thumbnailScrollPos', size);
        
        helper.thumbnailControllButtonManager(component);
    },
    
    showInCarousel: function(component, event, helper){
        helper.changePageNumber(component, event, helper);
    }
    
})