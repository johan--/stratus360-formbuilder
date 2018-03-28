module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    function(
      formioComponentsProvider
    ) {
      formioComponentsProvider.register('buttonprint', {
        title: 'Print Button',
        template: 'formio/components/buttonprint.html',
        group: 'advanced',
        settings: {
          input: false,
          availablePrintType: [
            'DOCX',
            'PDF'
          ],
          printType: '',
          label: 'Print Button',
          attachmentId:'',
          attachmentName:'',
          callback: undefined
        },
        viewTemplate: 'formio/componentsView/buttonprint.html',
        fbtemplate: 'formio/formbuilder/buttonprint.html',
        icon: 'fa fa-print',
        views: [
          {
            name: 'Display',
            template: 'formio/components/buttonprint/display.html'
          },
          {
            name: 'API',
            template: 'formio/components/common/api.html'
          }
        ],
        onEdit: ['$scope', function($scope) {
          $scope.upload = function() {
            $scope.component.callback($scope);
          };
        }],
      });
    }
  ]);
  app.run([
    '$templateCache',
    function($templateCache) {
      $templateCache.put('formio/components/buttonprint.html',
                               '<a href="#" class="btn btn-primary"><i class="fa fa-print"></i> {{component.label}}</a>'
                              );
            
            $templateCache.put('formio/componentsView/buttonprint.html',
                               '<a href="#" class="btn btn-primary"><i class="fa fa-print"></i> {{component.label}}</a>'
                              );
            
            $templateCache.put('formio/formbuilder/buttonprint.html',
                               '<a href="#" class="btn btn-primary"><i class="fa fa-print"></i> {{component.label}}</a>'
                              );
            
            $templateCache.put('formio/components/buttonprint/display.html',
                               '<ng-form>' +
                                '<form-builder-option property="label"></form-builder-option>' +
                                '<div class="form-group">' +
                                  '<label for="printType" form-builder-tooltip="Print mode of this button.">{{\'Print As\' | formioTranslate}}</label>' +
                                  '<select class="form-control" id="printType" name="printType" ng-options="pt | formioTranslate for pt in component.availablePrintType" ng-model="component.printType"></select>' +
                                '</div>' +
                                '<div class="form-group">' +
                                  '<label for="attachmentName" form-builder-tooltip="Template Name">{{\'Template Name\' | formioTranslate}}</label>' +
                                  '<input type="text" class="form-control" id="attachmentName" name="attachmentName" ng-model="component.attachmentName" disabled/>' +
                                '</div>' +
                                '<div class="form-group">' +
                                  '<a href="#" class="btn btn-primary" ng-click="upload()"><i class="fa fa-upload"></i> Upload Template</a>'+  
                                '</div>' +
                                '<form-builder-option property="customClass"></form-builder-option>' +
                                '<form-builder-option property="hidden"></form-builder-option>' +
                                '<form-builder-option property="disabled"></form-builder-option>' +
                              '</ng-form>'
                              );
    }
  ]);
};
