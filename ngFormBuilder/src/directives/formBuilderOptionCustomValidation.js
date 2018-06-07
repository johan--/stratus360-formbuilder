/**
* A directive for editing a component's custom validation.
*/
module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    template: '' +
      '<div>' +
      '<uib-accordion>' +
      '  <div uib-accordion-group heading="JSON Validation" class="panel panel-default">' +
      '    <small>' +
      '      <p>Execute custom validation logic with JSON and <a href="http://jsonlogic.com/">JsonLogic</a>.</p>' +
      '      <p>Submission data is available as JsonLogic variables, with the same api key as your components.</p>' +
      '      <p><a href="http://formio.github.io/formio.js/app/examples/conditions.html" target="_blank">Click here for an example</a></p>' +
      '    </small>' +
      '    <textarea class="form-control" rows="5" id="json" name="json" json-input ng-model="component.validate.json" placeholder=\'{ ... }\'></textarea>' +
      '    <p>Validation Failure Message</p>' +
      '    <textarea class="form-control" rows="2" id="failureValidationMessage" name="failureValidationMessage" ng-model="component.validate.failureValidationMessage"></textarea>' +
      '  </div>' +
      '</uib-accordion>' +
      '</div>'
  };
};
