({
	myAction : function(component, event, helper) {
		
	},
    scriptsLoaded: function(component, event, helper) {
		console.log('sccript loaded');
	},
    handleOnChange:function(component, event, helper) {
        var phonevalid=component.find("CompId");
        var phDetail=phonevalid.get("v.value");
        var phcheck=phDetail.replace(/\W/g, '');  
        if(phcheck.match(/[^0-9]/) || phcheck.length !=10){
            //$A.util.addClass(phonevalid, 'slds-has-error');
             phonevalid.set("v.errors", [{message: "Please Enter a Valid phone number" } ]);
       } else {
             phonevalid.set("v.errors", [{message: null}]);
        }    
      }
	  
  })