({
	doInit : function(component, event, helper) {
		component.set('v.IsMissingValueLocal',component.get('v.IsMissingValue'));
	},
    scriptsLoaded: function(component, event, helper) {
		console.log('sccript loaded');
	},
    handleOnChange:function(component, event, helper) {
      if(component.get('v.IsValidateRequired')){
          var phonevalid = component.find("inputPhone");
          var phDetail = phonevalid.get("v.value");
          //var phcheck = phDetail.replace(/\W/g, '');  
          var phcheck = phDetail;  
          // if(phcheck.match(/[^0-9]/)){
          console.log('phone.match result: ', phcheck.match(/\(?\d{3}[ )-]? ?\d{3}[ -]?\d{4}$/));
          //alert(phcheck.match(/^\(?\d{3}[ )-]? ?\d{3}[ -]?\d{4}$/));
          if(phcheck!='')
          {
            ////debugger;
            if(!phcheck.match(/^([\s\)\(+-]*\d[\s\)\(+-]*){10,}$/)){
                //$A.util.addClass(phonevalid, 'slds-has-error');
                 phonevalid.set("v.errors", [{message: "Please Enter a Valid phone number e.g. (123) 456-7890" } ]);
                 component.set("v.ErrorMessage","Error"); 
            } else {
                 phonevalid.set("v.errors", [{message: null}]);
                 component.set("v.ErrorMessage","");
            }
          }else{
            phonevalid.set("v.errors", [{message: null}]);
            component.set("v.ErrorMessage","");
          }
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