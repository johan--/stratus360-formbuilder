/**
* A directive for editing a component's custom validation.
*/
module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    template: '' +
      '<div class="form-group">' +
      ' <label for="target" form-builder-tooltip="Make this field required when certain condition is met">{{\'Required when?\' | formioTranslate}}</label>' +
      ' <div>'+
      '   <label><input type="radio" ng-model="component.validate.required" value="yes">Yes is Selected</label></br>'+
      '   <label><input type="radio" ng-model="component.validate.required" value="no">No is Selected</label></br>'+
      '   <label><input type="radio" ng-model="component.validate.required" value="all">Yes or No is Selected</label></br>'+
      ' </div>' +
      '</div>'
  };
};
