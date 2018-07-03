({
  doInit: function(component, event, helper) {
    helper.setDefaultValue(component);
  },

  onValueChange: function(component, event, helper) {
      debugger;
    helper.setDefaultValue(component);

    // validate required field
    helper.validateRequireField(component);
    // validate field
    helper.validateField(component);

    var evt = component.getEvent('OnChange');
    evt.setParams({
      "CompId": component.get('v.CompId'),
      "Payload": component.get('v.Value')
    });
    evt.fire();
  },

  handleOnBlur: function(component, event, helper) {
    var evt = component.getEvent('OnBlur');
    evt.setParams({
      "CompId": component.get('v.CompId')
    });
    evt.fire();
    if (component.get("v.BroadcastRender")) {
      var evt2 = $A.get("e.c:S360_Base_renderChange");
      evt2.setParams({
        "CompId": component.get("v.CompId")
      });
      evt2.fire();
    }
  },

  handleValidationFail: function(component, event, helper) {
    debugger;
    var params = event.getParam('arguments');
    var message = '';
    if (params) {
      message = params.message || component.get('v.FailureValidationMessage');
    }
    helper.toggleErrorMessage(component, false, message);
  },

  handleValidationSuccess: function(component, event, helper) {
		component.set('v.Valid', true);
		component.set('v.Message', "");
	},
    
    test: function(component){
        alert(1);
    }
})