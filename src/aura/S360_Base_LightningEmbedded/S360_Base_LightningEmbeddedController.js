({
    doInit : function(cmp, event, helper){
        console.log('xxx');
        console.log(cmp.get('v.label'));
        console.log(cmp.get('v.Attributes'));

        $A.createComponent(
            'S360_FA:'+cmp.get('v.label'), cmp.get('v.Attributes'),
  
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
    }
           
  
})