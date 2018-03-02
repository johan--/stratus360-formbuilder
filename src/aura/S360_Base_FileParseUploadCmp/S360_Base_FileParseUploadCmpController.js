({
    init : function(component, event, helper){
      	
        console.log(component.find('spinner').getEvent());
    },
    
    change : function(comp, event, helper){
      	var fileInput = comp.find("fileSelected").getElement();
        var file = fileInput.files[0];
        
        if(file){
            comp.set('v.FileLabel', file.name);
        }else{
            comp.set('v.FileLabel', 'Choose File');
        }
    },
    
	save : function(component, event, helper) {
        var fileInput = component.find("fileSelected").getElement();
        var file = fileInput.files[0];

        if((file != null) && (file != undefined))
        {
            helper.save(component, event, helper);
        }else{
            helper.response(
                component, 
                false, 
                ['You must choose file to upload!'],
                [],
                ''
            );
        }
    },
    
    showSpinner : function (component, event, helper) {
        var spinner = component.find("spinner");
        $A.util.removeClass(spinner, 'slds-hide');
        $A.util.addClass(spinner, 'slds-show');
    },
    
    hideSpinner : function (component, event, helper) {
        
        var spinner = component.find("spinner");
        $A.util.removeClass(spinner, 'slds-show');
        $A.util.addClass(spinner, 'slds-hide');
    },
    
    clear : function(comp, evt, hlp){
        comp.set('v.FileLabel', 'Choose File');
        hlp.clearInputFile(comp);
    }
})