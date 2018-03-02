({  
    doInit : function(component, event, helper) {
        component.set('v.InitFileLabel', component.get('v.FileLabel'));
    },

    save : function(component, event, helper) {
        //set blank - so it doesn't display until done loading
        component.set("v.ImageId", null);

        var fileInput = component.find("fileSelected").getElement();
        var file = fileInput.files[0];
        
        if((file != null) && (file != undefined))
        {
            component.set('v.FileLabel', file.name);
            helper.save(component, event, helper);
        }else{
            component.set('v.FileLabel', component.get('v.InitFileLabel'));
        }

    },

     showSpinner : function (component, event, helper) {
        var displayImageDiv = component.find("displayImageDiv");
        $A.util.addClass(displayImageDiv, 'slds-hide');  

        /*var spinner = component.find('spinner');
        var evt = spinner.get("e.toggle");
        evt.setParams({ isVisible : true });
        evt.fire();*/
        var spinner = component.find("spinner");
        $A.util.removeClass(spinner, 'slds-hide');
        $A.util.addClass(spinner, 'slds-show');
    },
    
    hideSpinner : function (component, event, helper) {
        var displayImageDiv = component.find("displayImageDiv");
        $A.util.removeClass(displayImageDiv, 'slds-hide');  

        /*var spinner = component.find('spinner');
        var evt = spinner.get("e.toggle");
        evt.setParams({ isVisible : false });
        evt.fire();*/
        var spinner = component.find("spinner");
        $A.util.removeClass(spinner, 'slds-show');
        $A.util.addClass(spinner, 'slds-hide');
    },

    showImage : function(component, event, helper) {
        var fileIdEvent = component.getEvent("xFileIdEvent");
        component.set("v.ImageId", event.getParam('XFileId'));
    },

    parentIdChange : function(component, event, helper) {
        //alert(component.get("v.ParentId"));
        helper.getImageId(component);    
    },

})