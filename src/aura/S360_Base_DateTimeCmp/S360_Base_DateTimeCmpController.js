({
    init : function(component, event, helper){
        if(component.get('v.Date') == '' || component.get('v.Date') == undefined){
            //debugger;
            if(component.get('v.DefaultDate') != '' && component.get('v.DefaultDate') != undefined){
             	component.set('v.Date', component.get('v.DefaultDate'));   
            }
        }
        
    	component.set('v.InitDate', component.get('v.Date'));
    },
    
	handleOnChange: function(component, event, helper){
        console.log(component.get('v.Date'));//debugger;
        if(component.get('v.Date') != component.get('v.InitDate')){
         	var evt = component.getEvent('OnChange');
            evt.setParams({
                "CompId": component.get('v.CompId'),
                "Payload": component.get('v.Date')
            });
            evt.fire();
            
            component.set('v.InitDate', component.get('v.Date'));     
            
            //Updating data for validation
            var CompId = component.get('v.CompId');
            var Value = component.get('v.Date');
    
            //Function definitions for use in JSLogic
            var getVal = function(CompId){
                return component.get('v.Data[' + CompId + ']');
            };
    
            var getThis = function(){
                return component.get('v.CompId');
            };
    
            //Adding Functions to JSLogic
            if(jsonLogic != undefined && jsonLogic != ''){
                jsonLogic.add_operation("get", getVal);
                jsonLogic.add_operation("this", getThis);
                
                //JSLogic Validation
                var validateJson = component.get('v.Json');
                
                if(validateJson != undefined && validateJson != "") {
                    var valid = jsonLogic.apply(validateJson);
                    
                    if(valid === true){
                        component.set('v.Valid', true);
                    }
                    else {
                        component.set('v.Valid', false);
                        component.set('v.Message', valid);
                    }
                }   
            }
        }
    }
})