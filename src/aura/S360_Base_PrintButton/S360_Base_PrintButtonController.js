({
    scriptsLoaded : function(component, event, helper) {
        helper.downloadTemplateHelper(component);
    },
    
    onClick: function(component, event, helper){
        helper.printAsDocx(component, event, helper);
    }
})