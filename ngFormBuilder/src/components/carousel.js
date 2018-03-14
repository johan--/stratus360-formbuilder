module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    function(
      formioComponentsProvider
    ) {
      formioComponentsProvider.register('carousel', {
        title: 'Carousel',
        template: 'formio/components/carousel.html',
        group: 'advanced',
        settings: {
          input: false,
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
          resource: '',
          resourceType: [
          {
            name: 'image',
            title: 'Image'
          },
          {
            name: 'video',
            title: 'Video'
          },
          ],
          videoResourceType: [
          {
            name: 'youtube',
            title: 'Youtube'
          },
          {
            name: 'vimeo',
            title: 'Vimeo'
          },
          {
            name: 'vidyard',
            title: 'Vidyard'
          },
          {
            name: 'brainshark',
            title: 'Brainshark'
          },
          ],
          localDefinitions: [
          ],
          salesforce: {
            carouselObject: '',
            carouselCaptionField: '',
            carouselParentField: '',
            carouselTypeField: '',
            carouselVideoTypeField: '',
            carouselVideoIdField: ''
          }
        },
        onEdit: ['$scope', function($scope) {
          $scope.removeColumn = function(index) {
            if($scope.component.resource === 'localDefinition'){
              $scope.component.localDefinitions.splice(index, 1);
            }
          };
          $scope.addColumn = function() {
            if($scope.component.resource === 'localDefinition'){
              $scope.component.localDefinitions.push({});  
            }
          };
        }],
        viewTemplate: 'formio/componentsView/carousel.html',
        fbtemplate: 'formio/formbuilder/carousel.html',
        icon: 'fa fa-desktop',
        views: [
        {
          name: 'Display',
          template: 'formio/components/carousel/display.html'
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
      $templateCache.put('formio/components/carousel.html',
                               '<p>carousel components</p>'
                              );
            
            $templateCache.put('formio/componentsView/carousel.html',
                               '<p>carousel componentsView</p>'
                              );
            
            $templateCache.put('formio/formbuilder/carousel.html',
                               '<div style="width: 100%;height: 360px;background: #4c4c4c;display: flex;flex-direction: column;flex-wrap: wrap;justify-content:center;align-items: center;">'+
                                    '<p style="color: white;font-size: 3.5em;text-align: center;">This is Carousel</p>'+
                                    '<div style="width: 100%;height: 30px;background: #4286f5;position: absolute;bottom: 0;padding: 7px;">'+
                                        '<i class="fa fa-play" style="color: white;display: inline;position: absolute;right: 5px;"></i>'+
                                        '<div style="position: absolute;width: 100%;height: 100%;top: 0;left: 0;display: flex;flex-direction: column;justify-content: center;text-align: center;">'+
                                            '<label style="color: white;">Captions</label>'+
                                        '</div>'+
                                        '<i class="fa fa-play" style="color: white;transform: scaleX(-1);position: absolute;left: 5px;"></i>'+
                                    '</div>'+
                                '</div>'
                              );
            
            $templateCache.put('formio/components/carousel/display.html',
                               '<ng-form>' +
                               '  <div class="form-group">' +
                               '    <label for="resource" form-builder-tooltip="Resource of this carousel">'+
                               '      {{\'Resource\' | formioTranslate}}'+
                               '    </label>' +
                               '    <select class="form-control" id="resource" name="resource" ng-options="resource.name as resource.title | formioTranslate for resource in component.resources" ng-model="component.resource"></select>' +
                               '  </div>' +
                               '  <div class="form-group" ng-if="component.resource === \'localDefinition\'">' +
                               '    <label form-builder-tooltip="The width, offset, push and pull settings for the columns">{{\'Dependent Field\' | formioTranslate}}</label>' +
                               '      <table class="table table-condensed">' +
                               '        <thead>' +
                               '          <tr>' +
                               '            <th class="col-xs-4">{{\'Caption\' | formioTranslate}}</th>' +
                               '            <th class="col-xs-3">{{\'Type\' | formioTranslate}}</th>' +
                               '            <th class="col-xs-4">{{\'Value\' | formioTranslate}}</th>' +
                               '            <th class="col-xs-1"></th>' +
                               '          </tr>' +
                               '        </thead>' +
                               '        <tbody>' +
                               '          <tr ng-repeat="row in component.localDefinitions">' +
                               '            <td class="col-xs-4"><input type="text" class="form-control" ng-model="row.caption"/></td>' +
                               '            <td class="col-xs-3"><select class="form-control" ng-options="opp.name as opp.title for opp in component.resourceType" ng-model="row.type"></select></td>' +
                               '            <td class="col-xs-4">'+
                               '              <input type="text" class="form-control" ng-if="row.type === \'image\'" ng-model="row.imageUrl" placeholder="Image url"/>'+
                               '              <div ng-if="row.type === \'video\'">'+
                               '                <select class="form-control" ng-options="vt.name as vt.title | formioTranslate for vt in component.videoResourceType" ng-model="row.videoType"></select>'+
                               '                <input type="text" class="form-control" ng-model="row.videoId" placeholder="Video ID"/>'+
                               '              </div>'+
                               '            </td>' +
                               '            <td class="col-xs-1"><button type="button" class="btn btn-danger btn-xs" ng-click="removeColumn($index)" tabindex="-1"><span class="glyphicon glyphicon-remove-circle"></span></button></td>' +
                               '          </tr>' +
                               '        </tbody>' +
                               '      </table>' +
                               '    <button type="button" class="btn btn-default" ng-click="addColumn()">{{\'Add Resource\' | formioTranslate}}</button>' +
                               '  </div>'+
                               '  <div class="form-group" ng-if="component.resource === \'salesforce\'">' +
                               '    <label for="carouselObject" form-builder-tooltip="The child object related to this object which will save the carousel information">{{\'Carousel Object\' | formioTranslate}}</label>' +
                               '    <input type="text" class="form-control" id="carouselObject" name="carouselObject" ng-model="component.salesforce.carouselObject" placeholder="Carousel Object" />' +
                               '  </div>' +
                               '  <div class="form-group" ng-if="component.resource === \'salesforce\'">' +
                               '    <label for="carouselParentField" form-builder-tooltip="The child object field that store relation to this object">{{\'Carousel Parent Field\' | formioTranslate}}</label>' +
                               '    <input type="text" class="form-control" id="carouselParentField" name="carouselParentField" ng-model="component.salesforce.carouselParentField" placeholder="Carousel Parent Field" />' +
                               '  </div>' +
                               '  <div class="form-group" ng-if="component.resource === \'salesforce\'">' +
                               '    <label for="carouselCaptionField" form-builder-tooltip="The field which will save carousel caption information">{{\'Carousel Caption Field\' | formioTranslate}}</label>' +
                               '    <input type="text" class="form-control" id="carouselCaptionField" name="carouselCaptionField" ng-model="component.salesforce.carouselCaptionField" placeholder="Carousel Caption Field" />' +
                               '  </div>' +
                               '  <div class="form-group" ng-if="component.resource === \'salesforce\'">' +
                               '    <label for="carouselTypeField" form-builder-tooltip="The field which will save carousel type information">{{\'Carousel Type Field\' | formioTranslate}}</label>' +
                               '    <input type="text" class="form-control" id="carouselTypeField" name="carouselTypeField" ng-model="component.salesforce.carouselTypeField" placeholder="Carousel Type Field" />' +
                               '  </div>' +
                               '  <div class="form-group" ng-if="component.resource === \'salesforce\'">' +
                               '    <label for="carouselVideoTypeField" form-builder-tooltip="The field which will save carousel video type information">{{\'Carousel Video Type Field\' | formioTranslate}}</label>' +
                               '    <input type="text" class="form-control" id="carouselVideoTypeField" name="carouselVideoTypeField" ng-model="component.salesforce.carouselVideoTypeField" placeholder="Carousel Video Type Field" />' +
                               '  </div>' +
                               '  <div class="form-group" ng-if="component.resource === \'salesforce\'">' +
                               '    <label for="carouselVideoIdField" form-builder-tooltip="The field which will save carousel video id information">{{\'Carousel Video Id Field\' | formioTranslate}}</label>' +
                               '    <input type="text" class="form-control" id="carouselVideoIdField" name="carouselVideoIdField" ng-model="component.salesforce.carouselVideoIdField" placeholder="Carousel Video Id Field" />' +
                               '  </div>' +
                               '</ng-form>'
                              );
    }
  ]);
};
