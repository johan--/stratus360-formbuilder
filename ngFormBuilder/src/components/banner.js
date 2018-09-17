module.exports = function(app) {
    app.config([
      'formioComponentsProvider',
      function(formioComponentsProvider) {
        formioComponentsProvider.register('banner', {
            title: 'Banner',
            group: "advanced",
            icon: 'fa fa-tv',
            views: [
            {
              name: 'Display',
              template: 'formio/components/banner/display.html'
            }
          ],
          settings: {
            input: false,
            localDefinitions: [],
            type: '',
            resources: [
                {
                  name: 'localDefinition',
                  title: 'Local Definition'
                },
                {
                  name: 'salesforce',
                  title: 'Salesforce'
                },
            ],
            salesforce: {
                bannerObject: '',
                carouselCaptionField: '',
                carouselParentField: '',
                carouselTypeField: '',
                carouselImageRedirectLinkField: '',
                carouselVideoTypeField: '',
                carouselVideoIdField: ''
              }
          },
          documentation: 'http://help.form.io/userguide/#banner'
        });
      }
    ]);
    app.run([
      '$templateCache',
      function($templateCache) {
        $templateCache.put('formio/formbuilder/banner.html',
        '<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">' +
            '<ol class="carousel-indicators indicators-container">' +
            '<li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>' +
            '<li data-target="#carouselExampleIndicators" data-slide-to="1"></li>' +
            '</ol>' +
            '<div class="carousel-inner">' +
            '<div class="carousel-item active">' +
                '<img class="d-block w-100" src="images/slide-1.png" alt="First slide">' +
            '</div>' +
            '<div class="carousel-item">' +
                '<img class="d-block w-100" src="images/slide-2.png" alt="Second slide">' +
            '</div>' +
            '</div>' +
        '</div>'
        );

        // Create the settings markup.
        $templateCache.put('formio/components/banner/display.html',
          '<ng-form>' +
            '<div class="form-group">' +
              '<label for="resource" form-builder-tooltip="Resource of this banner">'+
                '{{\'Resource\' | formioTranslate}}'+
              '</label>' +
              '<select class="form-control" id="resource" name="resource" ng-options="resource.name as resource.title | formioTranslate for resource in component.resources" ng-model="component.resource"></select>' +
            '</div>' +
            '<div class="form-group" ng-if="component.resource === \'salesforce\'">' +
                '<label for="carouselObject" form-builder-tooltip="The child object related to this object which will save the carousel information">{{\'Field 1\' | formioTranslate}}</label>' +
                '<input type="text" class="form-control" id="carouselObject" name="carouselObject" ng-model="component.salesforce.carouselObject" placeholder="Carousel Object" />' +
            '</div>' +
            '<div class="form-group" ng-if="component.resource === \'salesforce\'">' +
                '<label for="carouselParentField" form-builder-tooltip="The child object field that store relation to this object">{{\'Field 2\' | formioTranslate}}</label>' +
                '<input type="text" class="form-control" id="carouselParentField" name="carouselParentField" ng-model="component.salesforce.carouselParentField" placeholder="Carousel Parent Field" />' +
            '</div>' +
            '<div class="form-group" ng-if="component.resource === \'salesforce\'">' +
                '<label for="carouselCaptionField" form-builder-tooltip="The field which will save carousel caption information">{{\'Field 3\' | formioTranslate}}</label>' +
                '<input type="text" class="form-control" id="carouselCaptionField" name="carouselCaptionField" ng-model="component.salesforce.carouselCaptionField" placeholder="Carousel Caption Field" />' +
            '</div>' +
            '<div class="form-group" ng-if="component.resource === \'salesforce\'">' +
                '<label for="carouselTypeField" form-builder-tooltip="The field which will save carousel type information">{{\'Field 4\' | formioTranslate}}</label>' +
                '<input type="text" class="form-control" id="carouselTypeField" name="carouselTypeField" ng-model="component.salesforce.carouselTypeField" placeholder="Carousel Type Field" />' +
            '</div>' +
            '<div class="form-group" ng-if="component.resource === \'salesforce\'">' +
                '<label for="carouselImageRedirectLinkField" form-builder-tooltip="The field which will save carousel redirect link when image clicked">{{\'Field 5\' | formioTranslate}}</label>' +
                '<input type="text" class="form-control" id="carouselImageRedirectLinkField" name="carouselImageRedirectLinkField" ng-model="component.salesforce.carouselImageRedirectLinkField" placeholder="Carousel Redirect Link Field" />' +
            '</div>' +
            '<div class="form-group" ng-if="component.resource === \'salesforce\'">' +
                '<label for="carouselVideoTypeField" form-builder-tooltip="The field which will save carousel video type information">{{\'Field 6\' | formioTranslate}}</label>' +
                '<input type="text" class="form-control" id="carouselVideoTypeField" name="carouselVideoTypeField" ng-model="component.salesforce.carouselVideoTypeField" placeholder="Carousel Video Type Field" />' +
            '</div>' +
            '<div class="form-group" ng-if="component.resource === \'salesforce\'">' +
                '<label for="carouselVideoIdField" form-builder-tooltip="The field which will save carousel video id information">{{\'Field 7\' | formioTranslate}}</label>' +
                '<input type="text" class="form-control" id="carouselVideoIdField" name="carouselVideoIdField" ng-model="component.salesforce.carouselVideoIdField" placeholder="Carousel Video Id Field" />' +
            '</div>' +
          '</ng-form>'
        );
      }
    ]);
  };
  