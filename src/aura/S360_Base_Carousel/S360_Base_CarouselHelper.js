({
    doInit : function(component, event, helper)  {
        
        this.createSlideJSON(component.get("v.body"), component); 
        if(component.get('v.carouselObject') && component.get('v.parentId')){
         	this.getFromServer(component);   
        }
        
        var isAutoTimer = component.get("v.isAutoTimer");
        
        if(isAutoTimer){ 
            var delay = component.get("v.delay");
            window.setInterval(function(){
                helper.nextSlideTimer(component);
            },delay*1000);
        }
        
        var selecIndex = component.get('v.position'); 
        var captionsList = component.get("v.captionsList");
        if(captionsList && captionsList.length > 0){
            component.set("v.navigator", (selecIndex + 1) + " of " + captionsList.length + ' ' + captionsList[selecIndex]);
        }
    },
    createSlideJSON : function(slidefacet, component){
        var slides = component.get("v.slidersList");
        var captions = component.get("v.captionsList");
        
        if(!slides){
            slides = [];
        }
        
        if(!captions){
            captions = [];
        }
        
        var self = this;
        
        for (var i = 0; i < slidefacet.length; i++) { 
            if(slidefacet[i].isInstanceOf('aura:iteration')){
                var body = slidefacet[i].get('v.body');
                for (var j = 0; j < body.length; j++) { 
                    var isFocused = body[i].get("v.isFocused") ; 
                    if(i === 0 && j === 0){ 
                        isFocused=true; 
                    }
                    var singleSlide = {
                        imageURL : body[j].get("v.imageURL"),
                        isFocused: isFocused,
                        isImage : body[j].get("v.isImage"),
                        videoType : body[j].get("v.videoType"),
                        videoEmbedId : body[j].get("v.videoEmbedId"),
                        redirectURL : body[j].get("v.redirectURL"),
                    };      
                    slides.push(singleSlide);
                    
                    if(body[j].get("v.caption")){
                    	captions.push(body[j].get("v.caption"));
                    }else{
                    	captions.push('');
                    }
                }       
            }else{
             	var isFocused = slidefacet[i].get("v.isFocused") ; 
                if(i === 0){ 
                    isFocused=true; 
                }
                var singleSlide = {
                    imageURL : slidefacet[i].get("v.imageURL"),
                    isFocused: isFocused,
                    isImage : slidefacet[i].get("v.isImage"),
                    videoType : body[j].get("v.videoType"),
                    videoEmbedId : body[j].get("v.videoEmbedId"),
                    redirectURL : body[j].get("v.redirectURL"),
                };      
                slides.push(singleSlide);
                
                if(body[i].get("v.caption")){
                	captions.push(body[i].get("v.caption"));
                }else{
                	captions.push('');
                }
            }
        }
        
        component.set("v.slidersList",slides);
        component.set("v.captionsList",captions);
        
        
        var selecIndex = component.get('v.position');
        if(captions.length > 0){
            component.set("v.navigator", (selecIndex + 1) + " of " + captions.length + ' ' + captions[selecIndex]);
        }
        
    } ,
    
    
    getFromServer : function(component){
        var slides = component.get("v.slidersList");
        var captions = component.get("v.captionsList");
        
        if(!slides){
            slides = [];
        }
        
        if(!captions){
            captions = [];
        }
        
        var self = this;
        var action=component.get("c.getCarousel");
         action.setParams({
             "lookupParentField":component.get('v.lookupParentField'),
             "parentId":component.get('v.parentId'),
             "carouselObject":component.get('v.carouselObject'),
             "carouselCaptionField":component.get('v.carouselCaptionField'),
             "carouselTypeField":component.get('v.carouselTypeField'),
             "carouselVideoTypeField":component.get('v.carouselVideoTypeField'),
             "carouselVideoIdField":component.get('v.carouselVideoIdField'),
             "carouselImageRedirectLinkField":component.get('v.carouselImageRedirectLinkField'),
         });
        action.setStorable();
        
        action.setCallback(this,function(response) {
            var state = response.getState();
            //debugger;
            if(state=="SUCCESS"){
                if(response.getReturnValue()){
                    var carousel = [];
                    
                    response.getReturnValue().forEach(function(carousel){
                        if(carousel[component.get('v.carouselTypeField')] == 'video'){
                            slides.push({
                                isImage : false,
                                isFocused: false,
                                videoType : carousel[component.get('v.carouselVideoTypeField')],
                                videoEmbedId : carousel[component.get('v.carouselVideoIdField')]
                            });
                            
                            if(carousel[component.get('v.carouselCaptionField')]){
                                captions.push(carousel[component.get('v.carouselCaptionField')]);
                            }else{
                                captions.push('');
                            }
                        }else if(carousel[component.get('v.carouselTypeField')] == 'image'){
                            if(carousel.Attachments){
                                carousel.Attachments.forEach(function(attch){
                                    slides.push({
                                        imageURL : "/servlet/servlet.FileDownload?file="+ attch.Id,
                                        isImage : true,
                                        isFocused: false,
                                        redirectURL : carousel[component.get('v.carouselImageRedirectLinkField')],
                                    });
                                    
                                    if(carousel[component.get('v.carouselCaptionField')]){
                                        captions.push(carousel[component.get('v.carouselCaptionField')]);
                                    }else{
                                        captions.push('');
                                    }
                                });
                            }
                        }
                    });
                    
                    component.set('v.slidersList', slides);
                    component.set("v.captionsList",captions);
                    
                    var selecIndex = component.get('v.position');
                    if(captions.length > 0){
                        component.set("v.navigator", (selecIndex + 1) + " of " + captions.length + ' ' + captions[selecIndex]);
                    }
                }
            }
            
        });
        
        $A.enqueueAction(action);
    },
    
    nextSlideTimer : function(component){ 
        var slideInfo = component.get("v.slidersList");
        if(slideInfo){
            for (var i = 0; i < slideInfo.length; i++) { //its last slide and focused, so move to first again 
                if(slideInfo[i].isFocused && i >= slideInfo.length-1){
                    slideInfo[i].isFocused = false;
                    slideInfo[0].isFocused = true;
                    break;
                }else if(slideInfo[i].isFocused){
                    slideInfo[i].isFocused = false;
                    slideInfo[i+1].isFocused = true;
                    break;
                }
            }
        }
        component.set("v.slidersList",slideInfo); 
    },
    changePageNumber : function(component, event, helper){
        var target = event.target; 
        var selecIndex = parseInt(target.getAttribute("data-selected-Index")); 
        var slideInfo = component.get("v.slidersList");
        var captionsList = component.get("v.captionsList");
        
        if(slideInfo){
            for (var i = 0; i < slideInfo.length; i++) {   
                slideInfo[i].isFocused = false;
            }
            slideInfo[selecIndex].isFocused = true;
            
            
            if(captionsList && captionsList.length > 0){
            	component.set("v.navigator", (selecIndex + 1) + " of " + slideInfo.length + ' ' + captionsList[selecIndex]);
            }
        }
        
        component.set("v.slidersList",slideInfo);
        component.set('v.position', selecIndex);
        
        helper.animate(component, selecIndex);
    },
    
    changePageNumber2 : function(component, event, helper){
        var selecIndex = component.get('v.position'); 
        var slideInfo = component.get("v.slidersList");
        var captionsList = component.get("v.captionsList");
        alert(slideInfo.length);
        if(slideInfo){
            for (var i = 0; i < slideInfo.length; i++) {   
                slideInfo[i].isFocused = false;
            }
            slideInfo[selecIndex].isFocused = true;
            
            if(captionsList && captionsList.length > 0){
            	component.set("v.navigator", (selecIndex + 1) + " of " + slideInfo.length + ' ' + captionsList[selecIndex]);
            }
        }
        
        component.set("v.slidersList",slideInfo);
        
        helper.animate(component, selecIndex);
    },
    
    thumbnailControllButtonManager: function(component, thumbnailParent, thumbnailScroller){
        var thumbnailParent = component.find('carouselThumbnailsContainer').getElement();
        var thumbnailScroller = component.find('carouselThumbnailsScroller').getElement();
        var prevButton = component.find('thumbnailPrevBtn').getElement();
        var nextButton = component.find('thumbnailNextBtn').getElement();
        var size = component.get('v.thumbnailScrollPos');
        
        if(thumbnailParent.offsetWidth > thumbnailScroller.scrollWidth){
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        }else{
            if(thumbnailScroller.scrollWidth - Math.abs(size) - thumbnailParent.offsetWidth == 0){
            	prevButton.style.display = 'none';    
            }else{
                prevButton.style.display = 'block';
            }
            
            
            if(component.get('v.thumbnailScrollPos') >= 0){
             	nextButton.style.display = 'none';
            }else{
                nextButton.style.display = 'block';
            }
        }
    },
    
    animate: function(component, position){
        component.find('iterate').get('v.body').forEach(function(item){
            item.getElement().style.transform =  'translateX(' + (position * -100) + '%)';
        });
    },
    
    isIE: function(){
        var ua = window.navigator.userAgent;
        
        // Test values; Uncomment to check result …
        
        // IE 10
        // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
        
        // IE 11
        // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
        
        // Edge 12 (Spartan)
        // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
        
        // Edge 13
        // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';
        
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }
        
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }
        
        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }
        
        // other browser
        return false;
    }
})