({
	getAndSetFlags : function(component, pathsList) {
       
        var action = component.get("c.checkFieldValue");
        action.setParams({ fieldName : component.get("v.FieldName") ,
                           parentId: component.get("v.parentId"),
                           primaryObject: component.get("v.primaryObject")
                         });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var currentPickListValue = response.getReturnValue();
                console.log(response.getReturnValue());
                for(var i = 0; i<pathsList.length; i++){
                    console.log(pathsList[i].value);
                    if(pathsList[i].value == currentPickListValue[component.get("v.FieldName")]){
                        pathsList[i].status='selected';
                    }
                }
                

                if(component.get("v.Linear")=="YES"){
                    console.log("YESSSSS");
                    var found = false;
                    for(var i = pathsList.length-1; i>=0; i--){
                        if(found){
                            pathsList[i].status='complete';
                        }
                        else if(pathsList[i].status=='selected'){
                            found = true;
                        }
                    }
                }
				component.set("v.renderPaths", pathsList);
            }

            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });

        $A.enqueueAction(action);
	}
})