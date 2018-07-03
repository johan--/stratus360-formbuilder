module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    function(formioComponentsProvider) {
      formioComponentsProvider.register('language', {
        group: 'advanced',
        icon: 'fa fa-language',
        title: "Language",
        label: "Language",
        views: [
          {
            name: 'Display',
            template: 'formio/components/language/display.html'
          },

          /*{
            name: 'Layout',
            template: 'formio/components/common/layout.html'
          },
          {
            name: 'Conditional',
            template: 'formio/components/common/conditional.html'
          }*/
        ],
        settings:{
          label: '',
          input: true
        },
        viewTemplate: 'formio/componentsView/language.html',
        fbtemplate: 'formio/formbuilder/language.html',
        // onEdit: ['$scope', function($scope) {
        //   $scope.refreshField = function() {
        //     var rootScope = $scope.findTheRoot($scope);
        //     var inputFields = [];
        //
        //     if (rootScope.form) {
        //       inputFields = $scope.findInputTypeField(rootScope.form);
        //     }
        //
        //     $scope.component.inputFields = inputFields;
        //   };
        //
        //   $scope.findTheRoot = function(scope) {
        //     if (scope.rootList) {
        //       return scope;
        //     } else {
        //       return $scope.findTheRoot(scope['$parent']);
        //     }
        //   };
        //
        //   $scope.findInputTypeField = function(components) {
        //     var fields = [];
        //     components.components.forEach(function(cmp) {
        //       if (cmp.type == 'columns') {
        //         cmp.columns.forEach(function(col) {
        //           fields = fields.concat($scope.findInputTypeField(col));
        //         });
        //       } else if (cmp.type == 'fieldset' || cmp.type == 'well' || cmp.type == 'panel') {
        //         fields = fields.concat($scope.findInputTypeField(cmp));
        //       } else if (cmp.input) {
        //         fields.push(cmp.key);
        //       }
        //     });
        //
        //     return fields;
        //   };
        //
        //   $scope.onSelectedFlowChange = function() {
        //     debugger;
        //   };
        //
        //   $scope.initButton = function() {
        //     if ($scope.component.initButtonCallback) {
        //       $scope.component.initButtonCallback($scope);
        //     }
        //   };
        //
        // }],
      });
    }
  ]);
  app.run([
    '$templateCache',
    function($templateCache) {
      // Create the settings markup.
      $templateCache.put('formio/componentsView/language.html',
        '<a href="#" class="btn btn-primary"><i class="fa fa-language"></i> {{component.label}}</a>'
      );

      $templateCache.put('formio/formbuilder/language.html',
        '<a href="#" class="btn btn-primary"><i class="fa fa-language"></i> {{component.label}}</a>'
      );

      $templateCache.put('formio/components/language/display.html',
        '<ng-form>' +
          '<form-builder-option property="label"></form-builder-option>' +
          /*'<form-builder-option property="hideLabel"></form-builder-option>' +
          '<form-builder-option-label-position></form-builder-option-label-position>' +*/
          '<form-builder-option property="placeholder"></form-builder-option>' +
          /*'<form-builder-option property="description"></form-builder-option>' +*/
          '<form-builder-option property="tooltip"></form-builder-option>' +
          /*'<form-builder-option property="errorLabel"></form-builder-option>' +*/
          /*'<form-builder-option property="inputMask"></form-builder-option>' +*/
          /*'<form-builder-option property="prefix"></form-builder-option>' +
          '<form-builder-option property="suffix"></form-builder-option>' +*/
          '<form-builder-option property="customClass"></form-builder-option>' +
          /*'<form-builder-option property="tabindex"></form-builder-option>' +
          '<form-builder-option property="multiple"></form-builder-option>' +
          '<form-builder-option property="clearOnHide"></form-builder-option>' +
          '<form-builder-option property="protected"></form-builder-option>' +
          '<form-builder-option property="persistent"></form-builder-option>' +
          '<form-builder-option property="encrypted" class="form-builder-premium"></form-builder-option>' +*/
          '<form-builder-option property="hidden"></form-builder-option>' +
          /*'<form-builder-option property="autofocus" type="checkbox" label="Initial Focus" tooltip="Make this field the initially focused element on this form."></form-builder-option>' +*/
          '<form-builder-option property="disabled"></form-builder-option>' +
          /*'<form-builder-option property="dataGridLabel"></form-builder-option>' +
          '<form-builder-option property="tableView"></form-builder-option>' +*/
        '</ng-form>'
      );

      // Create the Validation markup.
    }
  ]);
};
