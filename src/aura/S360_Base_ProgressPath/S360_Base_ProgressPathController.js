({
    doInit : function(component, event, helper){
        var pathsList = component.get("v.paths");
        var fieldName = component.get("v.FieldName");
        console.log(pathsList);
        for(var i = 0; i<pathsList.length; i++){
            console.log(pathsList[i]);
            (pathsList[i])["status"] = 'incomplete';
            (pathsList[i])["fieldName"] = fieldName;
        }
        
        
        helper.getAndSetFlags(component, pathsList);

    },
    
    clicked : function(component, event, helper) {
        console.log(component.get("v.paths"));
        console.log(component.get("v.Name"));
        console.log(component.get("v.FieldName"));
        console.log(component.get("v.Linear"));
	}
})