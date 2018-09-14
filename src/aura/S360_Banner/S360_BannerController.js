({
    /*
       	Description: Method executed when component initialized
		Author: Stratus360
		Revision: Leo Lam, Aug 1/18, SF1205: Code documentation.
    */
    doInit: function(component, event, helper) {
        helper.doInit(component, event, helper);
    },

    /*
       	Description: (not used) Method executed when a banner indicator is clicked. It will show the slide of the clicked indicator
		Author: Stratus360
		Revision: Leo Lam, Aug 1/18, SF1205: Code documentation.
    */
    changePageNumber: function(component, event, helper) {
        helper.changePageNumber(component, event, helper);
    },

    /*
       	Description: executed when user clicks on the previous page button, goes to previous slide and resets auto timer
		Author: Stratus360
		Revision: Leo Lam, Aug 1/18, SF1205: Code documentation.
    */
    prevPage: function(component, event, helper) {
        helper.prevPage(component, event, helper);
    },

    /*
       	Description: executed when user clicks on the next page button, goes to next slide and resets auto timer
		Author: Stratus360
		Revision: Leo Lam, Aug 1/18, SF1205: Code documentation.
    */
    nextPage: function(component, event, helper) {
        helper.nextPage(component, event, helper);
    },

    /*
       	Description: executed once all the banner slides are done loading, fills in the captions in the slides
		Author: Stratus360
		Revision: Leo Lam, Aug 1/18, SF1205: Code documentation.
    */
    bannerLoaded: function(component, event, helper) {
        var captionContainers = document.getElementsByClassName('caption');

        Array.prototype.forEach.call(captionContainers, function(element) {
            var id = element.id.split('-');
            var num = id[1];
            var sliders = component.get('v.slidersList');
            element.innerHTML = sliders[num].caption;
        });
    }
})