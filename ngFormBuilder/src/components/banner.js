module.exports = function(app) {
    app.config([
      'formioComponentsProvider',
      function(formioComponentsProvider) {
        formioComponentsProvider.register('banner', {
            title: 'Banner',
            template: 'formio/components/banner.html',
            group: "advanced",
            views: [
            {
              name: 'Display',
              template: 'formio/components/banner/display.html'
            }
          ],
          settings: {
            input: false,
            resources: [
              {
                name: 'salesforce',
                title: 'Salesforce'
              },
            ],
            salesforce: {
                bannerName: '',
                activateAutoTimer: '',
                autoTimerDelay: 3,
              }
          },
          viewTemplate: 'formio/componentsView/banner.html',
          fbtemplate: 'formio/formbuilder/banner.html',
          icon: 'fa fa-tv',
          views: [
            {
              name: 'Display',
              template: 'formio/components/banner/display.html'
            }
            ]
        });
      }
    ]);
    app.run([
      '$templateCache',
      function($templateCache) {

        $templateCache.put('formio/components/banner.html',
          '<p>Preview unavailable.</p>'
        );

        $templateCache.put('formio/formbuilder/banner.html',
        '<div style="width: 100%;height: 360px;background: #4c4c4c;display: flex;flex-direction: column;flex-wrap: wrap;justify-content:center;align-items: center;">'+
            '<p style="color: white;font-size: 3.5em;text-align: center;">This is Banner</p>'+
            '<div style="display: flex; width: 100%; height: 30px; background: #4286f5; position: absolute; bottom: 0; padding: 7px;">'+
              '<ul style="display: flex; margin-left: auto; margin-right: auto; padding-inline-start: 0px;" role="tablist">' +
                '<li style="padding-right: 7px;">' +
                    '<div style="position: relative; display: inline-flex; margin: 0.25 rem">' +
                      '<i class="fa fa-play"></i>' +
                    '</div>' +
                '</li>' +
                '<li>' +
                  '<div style="position: relative; display: inline-flex; margin: 0.25 rem">' +
                    '<i class="fa fa-circle"></i>' +
                  '</div>' +
                '</li>' +
                '<li style="padding-left: 7px;">' +
                  '<div style="position: relative; display: inline-flex; margin: 0.25 rem">' +
                    '<i class="fa fa-circle-o"></i>' +
                  '</div>' +
                '</li>' +
              '</ul>' +
           '</div>' +
        '</div>'
        );

        $templateCache.put('formio/components/banner/display.html',
          '<ng-form>' +
            '<div class="form-group">' +
                '<label for="bannerName" form-builder-tooltip="The parent banner object that will host the banner slide objects.">{{\'Banner Name\' | formioTranslate}}</label>' +
                '<input type="text" class="form-control" id="bannerName" name="bannerName" ng-model="component.salesforce.bannerName" placeholder="Banner Name" required/>' +
            '</div>' +
            '<div class="checkbox form-group">' +
              '<label form-builder-tooltip="Activate auto timer for the banner.">' +
                '<input type="checkbox" id="activateAutoTimer" name="activateAutoTimer" ng-model="component.salesforce.activateAutoTimer"> {{\'Activate Auto Timer\' | formioTranslate}}' +
              '</label>' +
            '</div>' +
            '<div class="form-group" ng-if="component.salesforce.activateAutoTimer">' +
                '<label for="autoTimerDelay" form-builder-tooltip="Auto timer delay in seconds.">{{\'Auto Timer Delay\' | formioTranslate}}</label>' +
                '<input type="number" class="form-control" id="autoTimerDelay" name="autoTimerDelay" ng-model="component.salesforce.autoTimerDelay" min="1" max="100" onkeypress="event.preventDefault()" required/>' +
            '</div>' +
          '</ng-form>'
        );
      }
    ]);
  };