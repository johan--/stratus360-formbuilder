module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    function(
      formioComponentsProvider
    ) {
      formioComponentsProvider.register('captcha', {
        title: 'captcha',
                template: 'formio/components/captcha.html',
                group: 'advanced',
                settings: {
                    input: false,
                    captchaImagePreview: ''
                },
                viewTemplate: 'formio/componentsView/captcha.html',
                fbtemplate: 'formio/formbuilder/captcha.html',
                icon: 'fa fa-lock',
                views: [
                    {
                        name: 'Display',
                        template: 'formio/components/captcha/display.html'
                    },
                    {
                        name: 'API',
                        template: 'formio/components/common/api.html'
                    }
                ]
      });
    }
  ]);
  app.run([
    '$templateCache',
    function($templateCache) {
      $templateCache.put('formio/components/captcha.html',
                               '<img style="width: 250px;" src="{{component.captchaImagePreview}}">'
                              );
            
            $templateCache.put('formio/componentsView/captcha.html',
                               '<img style="width: 250px;" src="{{component.captchaImagePreview}}">'
                              );
            
            $templateCache.put('formio/formbuilder/captcha.html',
                               '<img style="width: 250px;" src="{{component.captchaImagePreview}}">'
                              );
            
            $templateCache.put('formio/components/captcha/display.html',
                               '<ng-form>' +
                               '<form-builder-option property="siteKey"></form-builder-option>' +
                               '<form-builder-option property="language"></form-builder-option>' +
                               '<form-builder-option property="customClass"></form-builder-option>' +
                               '</ng-form>'
                              );
            
    }
  ]);
};
