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
          token: "",
          herokuLink:"",
          availablePrintType: [
            'DOCX',
            'PDF'
          ],
          printType: '',
          availablePrintAction: 
          {
            'download' : 'Download',
            'saveAsAttachment' : 'Save to Attachment'
          },
          printAction : '',
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
            template: 'formio/components/common/apiNew.html'
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
                                  '<label for="printAction" form-builder-tooltip="Print action of this button.">{{\'Print Action\' | formioTranslate}}</label>' +
                                  '<select class="form-control" id="printAction" name="printAction" ng-options="key as value | formioTranslate for (key, value) in component.availablePrintAction" ng-model="component.printAction"></select>' +
                                '</div>' +
                                '<div class="form-group">'+
                                '<label ng-show ="component.printType==\'PDF\'" for="Name" form-builder-tooltip="This is the action to be performed by this button.">{{\'Heroku link for the PDF Conversion REST API\' | formioTranslate}}</label>' +
                                '<input id="herokuLink" name="herokuLink" type="text" ng-model="component.herokuLink" ng-show ="component.printType==\'PDF\'"placeholder="Heroku Link" property="example" label-validator="" required="required" class="form-control ng-pristine ng-valid ng-not-empty ng-valid-required ng-touched">' +
                                '</div>' +
                                '<div class="form-group">'+
                                '<label ng-show ="component.printType==\'PDF\'" for="Name" form-builder-tooltip="This is the action to be performed by this button.">{{\'Token for PDF Conversion\' | formioTranslate}}</label>' +
                                '<input id="token" name="token" type="text" ng-model="component.token" ng-show ="component.printType==\'PDF\'"placeholder="Token" property="example" label-validator="" required="required" class="form-control ng-pristine ng-valid ng-not-empty ng-valid-required ng-touched">' +
                                '</div>' +
                                '</div>'+

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
