({
    /*
       	Description: Method executed when component initialized, gets carousel details from backend and generates slide objects
		Author: Stratus360
		Revision: Leo Lam, Aug 1/18, SF1205: Code documentation.
    */
    doInit: function(component, event, helper) {
        var action = component.get("c.getCarousel");
        action.setParams({
            carouselName: component.get('v.source')
        });
        action.setStorable();
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                if (response.getReturnValue()) {
                    //array to hold all slide objects
                    var slides = [];
                    var height = 0;
                    var isFocused = false;
                    response.getReturnValue().forEach(function(s, index) {
                        isFocused = false;
                        if (s.S360_FA__Height__c != 0) {
                            height = s.S360_FA__Height__c;
                        }

                        //set the first slide as focused
                        if (index == 0) {
                            isFocused = true;
                        }

                        //set a left location if none specified by subtracting from right location
                        if (!s.S360_FA__Image_Focus_Location_Left__c) {
                            if (s.S360_FA__Image_Focus_Location_Right__c) {
                                s.S360_FA__Image_Focus_Location_Left__c = 100 - s.S360_FA__Image_Focus_Location_Right__c;
                            }
                            else {
                                //default left location to 50
                                s.S360_FA__Image_Focus_Location_Left__c = 50;
                            }
                        }

                        //set a right location if none specified by subtracting from left location
                        if (!s.S360_FA__Image_Focus_Location_Right__c) {
                            if (s.S360_FA__Image_Focus_Location_Left__c) {
                                s.S360_FA__Image_Focus_Location_Right__c = 100 - s.S360_FA__Image_Focus_Location_Left__c;
                            }
                            else {
                                //default right location to 50
                                s.S360_FA__Image_Focus_Location_Right__c = 50;
                            }
                        }

                        //generate slide object
                        var singleSlide = {
                            imageUrl: s.S360_FA__Image_URL__c,
                            buttonUrl: s.S360_FA__Button_URL__c,
                            Name: s.Name,
                            altText: s.S360_FA__Alt_Text__c,
                            isFocused: isFocused,
                            caption: s.S360_FA__HTML_Text__c,
                            focusLeft: s.S360_FA__Image_Focus_Location_Left__c,
                            focusRight: s.S360_FA__Image_Focus_Location_Right__c,
                            captionLocTop: s.S360_FA__Caption_Location_Top__c,
                            captionLocLeft: s.S360_FA__Caption_Location_Left__c
                        };

                        slides.push(singleSlide);
                    });

                    component.set("v.slidersList", slides);
                    component.set("v.height", height + 'px');
                    component.set("v.slideSize", slides.length);
                }
            } else if (response.getState() === "INCOMPLETE") {
                //Possibly offline
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    mode: 'sticky',
                    type: 'warning',

                    message: $A.get("$Label.c.S360_ErrorIncomplete")
                });
                toastEvent.fire();

            } else if (response.getState() === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        // console.log("Error message: " + 
                        //             errors[0].message);

                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            mode: 'error',
                            type: 'warning',

                            message: $A.get("$Label.c.S360_ErrorGeneric") + " ",
                            messageTemplate: $A.get("$Label.c.S360_ErrorGenericMessage") + ": {0} ",
                            messageTemplateData: ['Community', { error: errors[0] && errors[0].message }]

                        });
                        toastEvent.fire();

                    }
                } else {
                    // console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);

        var isAutoTimer = component.get("v.isAutoTimer");

        if (isAutoTimer) {
            var delay = component.get("v.delay");
            //set up interval to advance slides
            var timer = window.setInterval(function() {
                helper.nextSlideTimer(component);
            }, delay * 1000);
            component.set("v.timer", timer);
        }
    },

    /*
       	Description: (not used) creates slide json objects
		Author: Stratus360
		Revision: Leo Lam, Aug 1/18, SF1205: Code documentation.
    */
    createSlideJSON: function(slidefacet, component) {
        var autoColor = component.get("v.autoBgColor");
        var autoColorCounter = 0;
        var bgColors = ["#00bcd7", "#009788", "#0070d2", "#faac58", "#304a62", "#660099"];
        var titleColors = ["#000", "#fff", "#fff", "#000", "#fff", "#fff"];
        var slides = [];
        var currentBGColor, currentColor;

        for (var i = 0; i < slidefacet.length; i++) {
            var isFocused = slidefacet[i].get("v.isFocused");
            if (i === 0) {
                isFocused = true;
            }
            currentBGColor = slidefacet[i].get("v.bgColor");
            currentColor = slidefacet[i].get("v.titleColor");
            if (autoColor) {
                currentBGColor = bgColors[autoColorCounter];
                currentColor = titleColors[autoColorCounter];
                autoColorCounter++;
                if (autoColorCounter >= bgColors.length) {
                    autoColorCounter = 0;
                }
            }
            var singleSlide = {
                title: slidefacet[i].get("v.title"),
                content: slidefacet[i].get("v.content"),
                bgColor: currentBGColor,
                contentColor: currentColor,
                isFocused: isFocused
            };
            slides.push(singleSlide);
        }
        component.set("v.slidersList", slides);
    },

    /*
       	Description: advances the slide based on a timer tick
		Author: Stratus360
		Revision: Leo Lam, Aug 1/18, SF1205: Code documentation.
    */
    nextSlideTimer: function(component) {
        var slideInfo = component.get("v.slidersList");
        if (slideInfo) {
            for (var i = 0; i < slideInfo.length; i++) {
                //its last slide and focused, so move to the first slide
                if (slideInfo[i].isFocused && i >= slideInfo.length - 1) {
                    slideInfo[i].isFocused = false;
                    slideInfo[0].isFocused = true;
                    component.set("v.position", 0);
                    break;
                } else if (slideInfo[i].isFocused) {
                    slideInfo[i].isFocused = false;
                    slideInfo[i + 1].isFocused = true;
                    component.set("v.position", i + 1);
                    break;
                }
            }
        }
        component.set("v.slidersList", slideInfo);
    },

    /*
       	Description: (not used) Method executed when a carousel indicator is clicked. It will show the slide of the clicked indicator
		Author: Stratus360
		Revision: Leo Lam, Aug 1/18, SF1205: Code documentation.
    */
    changePageNumber: function(component, event, helper) {
        var target = event.target;
        var selecIndex = target.getAttribute("data-selected-Index");
        var slideInfo = component.get("v.slidersList");
        if (slideInfo) {
            for (var i = 0; i < slideInfo.length; i++) {
                slideInfo[i].isFocused = false;
            }
            slideInfo[selecIndex].isFocused = true;
        }
        component.set("v.slidersList", slideInfo);
        component.set("v.position", selecIndex);
    },

	/*
       	Description: executed when user clicks on the previous page button, goes to previous slide and resets auto timer
		Author: Stratus360
		Revision: Leo Lam, Aug 1/18, SF1205: Code documentation.
    */
    prevPage: function(component, event, helper) {
        var slideInfo = component.get("v.slidersList");
        var currentPos = component.get("v.position");
        if (slideInfo) {
            var prevPos;
            if (currentPos === 0)
                prevPos = slideInfo.length - 1;
            else
                prevPos = currentPos - 1;

            slideInfo[currentPos].isFocused = false;
            slideInfo[prevPos].isFocused = true;
        }
        component.set("v.slidersList", slideInfo);
        component.set("v.position", prevPos);
        var timer = component.get("v.timer");

        //reset auto timer because user has just changed slides
        var isAutoTimer = component.get("v.isAutoTimer");
        window.clearInterval(timer);
        if (isAutoTimer) {
            var delay = component.get("v.delay");
            timer = window.setInterval(function() {
                helper.nextSlideTimer(component);
            }, delay * 1000);
            component.set("v.timer", timer);
        }
    },

	/*
       	Description: executed when user clicks on the next page button, goes to next slide and resets auto timer
		Author: Stratus360
		Revision: Leo Lam, Aug 1/18, SF1205: Code documentation.
    */
    nextPage: function(component, event, helper) {
        var slideInfo = component.get("v.slidersList");
        var currentPos = component.get("v.position");
        if (slideInfo) {
            var nextPos;
            if (currentPos === (slideInfo.length - 1))
                nextPos = 0;
            else
                nextPos = currentPos + 1

            slideInfo[currentPos].isFocused = false;
            slideInfo[nextPos].isFocused = true;
        }
        component.set("v.slidersList", slideInfo);
        component.set("v.position", nextPos);
        var timer = component.get("v.timer");

        //reset auto timer because user has just changed slides
        var isAutoTimer = component.get("v.isAutoTimer");
        window.clearInterval(timer);
        if (isAutoTimer) {
            var delay = component.get("v.delay");
            timer = window.setInterval(function() {
                helper.nextSlideTimer(component);
            }, delay * 1000);
            component.set("v.timer", timer);
        }
    }
})