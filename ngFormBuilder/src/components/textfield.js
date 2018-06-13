module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    function(formioComponentsProvider) {
      formioComponentsProvider.register('textfield', {
        views: [
          {
            name: 'Display',
            template: 'formio/components/textfield/display.html'
          },
          {
            name: 'Data',
            template: 'formio/components/textfield/data.html'
          },
          {
            name: 'Validation',
            template: 'formio/components/textfield/validate.html'
          },
          {
            name: 'Rendering',
            template: 'formio/components/textfield/rendering.html'
          },
          {
            name: 'API',
            template: 'formio/components/textfield/apiNew.html'
          }
        ],
        documentation: 'http://help.form.io/userguide/#textfield'
      });
    }
  ]);
  app.run([
    '$templateCache',
    function($templateCache) {
      // Create the settings markup.
      $templateCache.put('formio/components/textfield/display.html',
        '<ng-form>' +
          '<form-builder-option property="label"></form-builder-option>' +
          '<form-builder-option property="placeholder"></form-builder-option>' +
          '<form-builder-option property="tooltip"></form-builder-option>' +
          '<form-builder-option property="customClass"></form-builder-option>' +
          '<form-builder-option property="hidden"></form-builder-option>' +
          '<form-builder-option property="disabled"></form-builder-option>' +
        '</ng-form>'
      );

      $templateCache.put('formio/components/textfield/apiNew.html',
        '<ng-form>' +
          '<form-builder-option-key-new></form-builder-option-key-new>' +
        '</ng-form>'
      );

      $templateCache.put('formio/components/textfield/data.html',
        '<form-builder-option text-mask property="defaultValue"></form-builder-option>'
      );

      $templateCache.put('formio/components/textfield/rendering.html',
        '<ng-form>' +
      //  '<render-subscribe-values form="form" component="component" data="component.values" default="component.defaultValue" label="Values" tooltip-text="The radio button values that can be picked for this field. Values are text submitted with the form data. Labels are text that appears next to the radio buttons on the form."></value-builder-with-shortcuts>' +
          '<input type="checkbox"   ng-model="component.broadcastRender"/> Dynamic Rendering? ' +
          '<label class="control-label" +" form-builder-tooltip="Enable this component to dynamically render the form"></label>' +

        '</ng-form>'
      );

      $templateCache.put('formio/components/textfield/validate.html',
        '<ng-form>' +
          '<form-builder-option property="validate.required"></form-builder-option>' +
          '<form-builder-option property="validate.maxLength"></form-builder-option>' +
          '<form-builder-option-custom-validation></form-builder-option-custom-validation>' +
        '</ng-form>'
      );
    }
  ]);
};
