/**
* A directive for editing a component's custom validation.
*/
module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    template: '' +
      '<div class="form-group">' +
      ' <label for="target" form-builder-tooltip="Make attachment required when certain condition is met">{{\'Attachment is required when?\' | formioTranslate}}</label>' +
      ' <div>'+
      '   <label><input type="radio" ng-model="component.validate.fieldRequired" value="yes">Yes is selected</label></br>'+
      '   <label><input type="radio" ng-model="component.validate.fieldRequired" value="no">No is selected</label></br>'+
      '   <label><input type="radio" ng-model="component.validate.fieldRequired" value="all">Yes or No is selected</label></br>'+
      '   <label><input type="radio" ng-model="component.validate.fieldRequired" value="none">Not required</label></br>'+
      ' </div>' +
      '</div>'
  };
};
