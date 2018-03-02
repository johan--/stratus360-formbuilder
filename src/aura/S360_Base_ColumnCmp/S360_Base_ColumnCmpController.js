({
    /*init : function(component, event, helper) {
        var config = component.get('v.Config');
        var totalWidth = 0;
        var childs = [];
        
        config.forEach(function(item){
            totalWidth += item.width;
        });
        
        config.forEach(function(item){
            childs.push([
                "c:S360_Base_ColumnItemCmp",{
                    "body": item.childs,
                    "Class": "slds-size_1-of-1 slds-medium-size_1-of-1 slds-large-size_"+ item.width +"-of-" + totalWidth
                }
            ]);
        });
        
        if(childs.length > 0){
            $A.createComponents(childs,function(cmp, status, errorMessage){
                if (status === "SUCCESS") {
                    component.set("v.body", cmp);
                }
                else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.")
                    // Show offline error
                }else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            });
        }
        
    }*/
})