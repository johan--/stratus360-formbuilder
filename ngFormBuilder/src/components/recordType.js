module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    function(
      formioComponentsProvider
    ) {
      formioComponentsProvider.register('recordtype', {
        title: 'Record Type Mapping',
        template: 'formio/components/recordtype.html',
        group: 'advanced',
        settings: {
          input: false,
          label: 'Record Type',
          actionType: '',
          availableActionType: [{
              label: 'Pass Data Only',
              value: 'pass_data_only'
            },
            {
              label: 'Save Only',
              value: 'save_only'
            },
            {
              label: 'Save and Pass Data',
              value: 'save_and_pass'
            }
          ],
          dataToPass: '',
          availableDataToPass: [{
              label: 'All',
              value: 'all'
            },
            {
              label: 'Custom',
              value: 'custom'
            }
          ],
          inputFields: [],
          selectedInputFields: [],
          recordts: [],
          forms: [],
          apis: ['S360_A','S360_B'],
          selectedRecordType: '',
          selectedForm: '',
          inputFlowMap: {},
          initButtonCallback: undefined,
          initButtonLabel: 'Populate Forms'
        },
        viewTemplate: 'formio/componentsView/recordtype.html',
        fbtemplate: 'formio/formbuilder/recordtype.html',
        icon: 'fa fa-folder-open',
        views: [{
            name: 'Record Type Mapping',
            template: 'formio/components/recordtype/inputconfig.html'
          },
          {
            name: 'API',
            template: 'formio/components/common/apiNew.html'
          }
        ],
        onEdit: ['$scope', function($scope) {
          $scope.refreshField = function() {
            var rootScope = $scope.findTheRoot($scope);
            var inputFields = [];

            if (rootScope.form) {
              inputFields = $scope.findInputTypeField(rootScope.form);
            }

            $scope.component.inputFields = inputFields;
          };

          $scope.findTheRoot = function(scope) {
            if (scope.rootList) {
              return scope;
            } else {
              return $scope.findTheRoot(scope['$parent']);
            }
          };

          $scope.findInputTypeField = function(components) {
            var fields = [];
            components.components.forEach(function(cmp) {
              if (cmp.type == 'columns') {
                cmp.columns.forEach(function(col) {
                  fields = fields.concat($scope.findInputTypeField(col));
                });
              } else if (cmp.type == 'fieldset' || cmp.type == 'well' || cmp.type == 'panel') {
                fields = fields.concat($scope.findInputTypeField(cmp));
              } else if (cmp.input) {
                fields.push(cmp.key);
              }
            });

            return fields;
          };

          $scope.onSelectedFlowChange = function() {
            debugger;
          };

          $scope.initButton = function() {
            if ($scope.component.initButtonCallback) {
              $scope.component.initButtonCallback($scope);
            }
          };

        }],
      });
    }
  ]);
  app.run([
    '$rootScope',
    '$templateCache',
    function($rootScope, $templateCache) {
      $templateCache.put('formio/components/recordtype.html',
        '<a href="#" class="btn btn-primary"><i class="fa fa-folder-open"></i> {{component.label}}</a>'
      );

      $templateCache.put('formio/componentsView/recordtype.html',
        '<a href="#" class="btn btn-primary"><i class="fa fa-folder-open"></i> {{component.label}}</a>'
      );

      $templateCache.put('formio/formbuilder/recordtype.html',
        '<a href="#" class="btn btn-primary"><i class="fa fa-folder-open"></i> {{component.label}}</a>'
      );

      $templateCache.put('formio/components/recordtype/inputconfig.html',
        '<ng-form>' +
        ' <div class="form-group">' +
        '   <label form-builder-tooltip="Select Record Type and Corresponding Form">{{\'Record Type Select\' | formioTranslate}}</label>' +
        '   <table class="table table-condensed">' +
        '     <thead>' +
        '         <th class="col-xs-6"><button type="button" class="btn btn-default" ng-click="initButton()">{{component.initButtonLabel | formioTranslate}}</button></th>' +
        '       <tr>' +
        '         <th class="col-xs-6"> Record Type </th>' +
        ' <th class="col-xs-6">' +
        '           Forms' +
        '         </th>' +
        '       </tr>' +
        '     <tbody>' +
        '       <tr ng-repeat="row in component.recordts">' +
        '         <td class="col-xs-6">'+
        '           <label>{{row.name}}</label>' +
        '         </td>' +
        '         <td class="col-xs-6">'+
        '           <select class="form-control" ng-model="component.inputFlowMap[row.Id]" ng-options="f as f.Name for f in component.forms">'+
        '         </td>' +
        '       </tr>' +
        '     </tbody>' +
        '     </thead>' +
        '   </table>' +
        ' </div>' +
        '</ng-form>'
      );


    }
  ]);
};
