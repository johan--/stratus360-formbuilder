({
    doInit : function(cmp, event, helper){
        var attr = cmp.get('v.Attributes');
        attr.DATA = cmp.getReference('v.data');
        cmp.set('v.Attributes', attr);
        
        $A.createComponent(
            cmp.get('v.label'), cmp.get('v.Attributes'),
            
            function(comp, status, errorMessage){
                
                //Add the new button to the body array
                
                if (status === "SUCCESS") {
                    
                    var embed = cmp.get("v.body");
                    
                    embed.push(comp);
                    
                    cmp.set("v.body", embed);
                    
                }
                
                else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.");
                    // Show offline error
                    
                }
                
                    else if (status === "ERROR") {
                        
                        console.log("Error: " + errorMessage);
                        
                        // Show error message
                        
                    }
                
            }
        )
    },
    
    
    check: function(cmp){
        alert(cmp.get('v.DATA.S360_FA__Last_Name__c'))
    }
    
    
})