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
      '  <div uib-accordion-group heading="Dynamic Rendering" class="panel panel-default">' +
      '    <small>' +
      '      <p>Execute custom validation logic with JSON and <a href="http://jsonlogic.com/">Dynamic Rendering</a>.</p>' +
      '      <p>Submission data is available as JsonLogic variables, with the same api key as your components.</p>' +
      '      <p><a href="http://formio.github.io/formio.js/app/examples/conditions.html" target="_blank">Click here for an example</a></p>' +
      '    </small>' +
      '    <textarea class="form-control" rows="5" id="render" name="render" json-input ng-model="component.render" placeholder=\'{ ... }\'></textarea>' +
      '    <p>Validation Failure Message</p>' +
      '    <textarea class="form-control" rows="2" id="failureRenderMessage" name="failureRenderMessage" ng-model="component.validate.failureRenderMessage"></textarea>' +
      '  </div>' +
      '</uib-accordion>' +
      '</div>'
  };
};
