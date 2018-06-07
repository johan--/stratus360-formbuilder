({
    scriptsLoaded : function(component, event, helper) {
        helper.downloadTemplateHelper(component);
        //svg4everybody();
    },
    
    onClick: function(component, event, helper){
        if((/pdf/i).test(component.get('v.PrintType'))){
            helper.printAsPDF2(component, event, helper);
        }else if((/docx/i).test(component.get('v.PrintType'))){
         	helper.printAsDocx(component, event, helper);
        }
    },
})