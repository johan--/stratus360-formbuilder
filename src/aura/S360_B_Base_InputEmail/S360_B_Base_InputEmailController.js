({
	doInit : function(component, event, helper) {
		component.set('v.IsMissingValueLocal',component.get('v.IsMissingValue'));
	},
    //EmailValidation
    handleOnChange:function(component, event, helper) {
		var isValidEmail = true; 
        var emailField = component.find("inputEmail");
        var emailFieldValue = emailField.get("v.value");
        var regExpEmailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;  
        if(!$A.util.isEmpty(emailFieldValue)){   
            if(emailFieldValue.match(regExpEmailformat)){
			        emailField.set("v.errors", [{message: null}]);
              $A.util.removeClass(emailField, 'slds-has-error');
              isValidEmail = true;
        }else{
             $A.util.addClass(emailField, 'slds-has-error');
             emailField.set("v.errors", [{message: "Please Enter a Valid Email Address" } ]);
             isValidEmail = false;
        }
       }
        if(isValidEmail){
         
       }
       
	},
  itemsChange: function(component, event, helper){
        
        if(component.get('v.Value') != '' && component.get('v.Value') != undefined){
            component.set('v.IsMissingValueLocal',false);
        }
        else{
            component.set('v.IsMissingValueLocal', true);
        }
        
        var evt = component.getEvent('OnChange');
        evt.setParams({
          "CompId": "InputPhone",
          "payload": component.get('v.Value')
        });
        evt.fire();
  },
    
})