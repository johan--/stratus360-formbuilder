module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    function(
      formioComponentsProvider
    ) {
      formioComponentsProvider.register('lookup', {
        title: 'lookup',
        template: 'formio/components/lookup.html',
        group: 'advanced',
        settings: {
          input: true,
          dependents: [],
          dependentType: ['String','Other'],
          dependentOperator: [' = ',' != ',' LIKE ']
        },
        viewTemplate: 'formio/componentsView/lookup.html',
        onEdit: ['$scope', function($scope) {
          $scope.removeColumn = function(index) {
            $scope.component.dependents.splice(index, 1);
          };
          $scope.addColumn = function() {
            $scope.component.dependents.push({});
          };
        }],
        fbtemplate: 'formio/formbuilder/lookup.html',
        icon: 'fa fa-search',
        views: [
        {
          name: 'Display',
          template: 'formio/components/lookup/display.html'
        },
        {
          name: 'API',
          template: 'formio/components/common/apiNew.html'
        },
        {
          name: 'Validate',
          template: 'formio/components/lookup/validate.html'
        }
        ]  
      });
    }
  ]);
  app.run([
    '$templateCache',
    function($templateCache) {
      $templateCache.put('formio/components/lookup.html',
       '<div class="form-group">' +
        '<label>{{component.label}}</label>' +
        '<div class="input-group" id="inputsLabelPosition">' +
          '<input type="text" class="form-control"/>' +
          '<span class="input-group-addon">' +
            '<i class="fa fa-search"></i>' +
          '</span>' +
        '</div>'+
       '</div>'
       );

      $templateCache.put('formio/componentsView/lookup.html',
       '<div class="form-group">' +
        '<label>{{component.label}}</label>' +
        '<div class="input-group" id="inputsLabelPosition">' +
          '<input type="text" class="form-control"/>' +
          '<span class="input-group-addon">' +
            '<i class="fa fa-search"></i>' +
          '</span>' +
        '</div>'+
       '</div>'
       );

      $templateCache.put('formio/formbuilder/lookup.html',
       '<div class="form-group">' +
        '<label>{{component.label}}</label>' +
        '<div class="input-group" id="inputsLabelPosition">' +
          '<input type="text" class="form-control"/>' +
          '<span class="input-group-addon">' +
            '<i class="fa fa-search"></i>' +
          '</span>' +
        '</div>'+
       '</div>'
       );

      $templateCache.put('formio/components/lookup/display.html',
       '<ng-form>' +
         '<form-builder-option property="label"></form-builder-option>' +
         '<form-builder-option property="parentObject" required></form-builder-option>' +
         '<div class="form-group">' +
           '<label form-builder-tooltip="The width, offset, push and pull settings for the columns">{{\'Dependent Field\' | formioTranslate}}</label>' +
           '<table class="table table-condensed">' +
            '<thead>' +
               '<tr>' +
                 '<th class="col-xs-2">{{\'Field\' | formioTranslate}}</th>' +
                 '<th class="col-xs-2">{{\'Type\' | formioTranslate}}</th>' +
                 '<th class="col-xs-2">{{\'Opp\' | formioTranslate}}</th>' +
                 '<th class="col-xs-2">{{\'Value\' | formioTranslate}}</th>' +
                 '<th class="col-xs-1"></th>' +
               '</tr>' +
            '</thead>' +
            '<tbody>' +
             '<tr ng-repeat="column in component.dependents">' +
               '<td class="col-xs-2"><input type="text" class="form-control" ng-model="column.field"/></td>' +
               '<td class="col-xs-2"><select class="form-control" id="dependentType" name="dependentType" ng-options="opp for opp in component.dependentType" ng-model="column.type"></select></td>' +
               '<td class="col-xs-2"><select class="form-control" id="dependentOperator" name="dependentOperator" ng-options="opp for opp in component.dependentOperator" ng-model="column.operator"></select></td>' +
               '<td class="col-xs-2"><input type="text" class="form-control" ng-model="column.value"/></td>' +
               '<td class="col-xs-1"><button type="button" class="btn btn-danger btn-xs" ng-click="removeColumn($index)" tabindex="-1"><span class="glyphicon glyphicon-remove-circle"></span></button></td>' +
             '</tr>' +
            '</tbody>' +
           '</table>' +
           '<button type="button" class="btn btn-default" ng-click="addColumn()">{{\'Add Dependent\' | formioTranslate}}</button>' +
         '</div>' +
       '</ng-form>'
       );


      $templateCache.put('formio/components/lookup/validate.html',
              '<ng-form>' +
                '<form-builder-option property="validate.required"></form-builder-option>' +
                '<form-builder-option-custom-validation></form-builder-option-custom-validation>' +
              '</ng-form>'
      );
    }
  ]);
};
