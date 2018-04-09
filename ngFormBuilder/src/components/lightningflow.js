module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    function(
      formioComponentsProvider
    ) {
      formioComponentsProvider.register('lightningflow', {
        title: 'Lightning Flow',
        template: 'formio/components/lightningflow.html',
        group: 'advanced',
        settings: {
          input: false,
          label: 'Lighting Flow',
          flowName: '',
          flowData: [],
          variableType: ['String','Number','Currency','Boolean','Picklist','Multipicklist','Date','DateTime','SObject']
        },
        viewTemplate: 'formio/componentsView/lightningflow.html',
        onEdit: ['$scope', function($scope) {
          $scope.removeColumn = function(index) {
            $scope.component.flowData.splice(index, 1);
          };
          $scope.addColumn = function() {
            $scope.component.flowData.push({});
          };
        }],
        fbtemplate: 'formio/formbuilder/lightningflow.html',
        icon: 'fa fa-long-arrow-right',
        views: [
        {
          name: 'Display',
          template: 'formio/components/lightningflow/display.html'
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
      $templateCache.put('formio/components/lightningflow.html',
       '<div class="form-group">' +
        '<label>{{component.label}}</label>' +
        '<div class="form-group" id="inputsLabelPosition">' +
          '<input type="text" class="form-control"/>' +
        '</div>'+
        '<div class="form-group" style="text-align:right" id="inputsLabelPosition">' +
          '<button type="button" class="btn btn-default" >{{\'Finish\' | formioTranslate}}</button>' +
        '</div>'+
       '</div>'
       );

      $templateCache.put('formio/componentsView/lightningflow.html',
       '<div class="form-group">' +
        '<label>{{component.label}}</label>' +
        '<div class="form-group" id="inputsLabelPosition">' +
          '<input type="text" class="form-control"/>' +
        '</div>'+
        '<div class="form-group" style="text-align:right" id="inputsLabelPosition">' +
          '<button type="button" class="btn btn-default" >{{\'Finish\' | formioTranslate}}</button>' +
        '</div>'+
       '</div>'
       );

      $templateCache.put('formio/formbuilder/lightningflow.html',
       '<div class="form-group">' +
        '<label>{{component.label}}</label>' +
        '<div class="form-group" id="inputsLabelPosition">' +
          '<input type="text" class="form-control"/>' +
        '</div>'+
        '<div class="form-group" style="text-align:right" id="inputsLabelPosition">' +
          '<button type="button" class="btn btn-default" >{{\'Finish\' | formioTranslate}}</button>' +
        '</div>'+
       '</div>'
       );

      $templateCache.put('formio/components/lightningflow/display.html',
       '<ng-form>' +
         '<form-builder-option property="label"></form-builder-option>' +
         '<form-builder-option property="flowName" required></form-builder-option>' +
         '<div class="form-group">' +
           '<label form-builder-tooltip="Data to initialize the flow if available">{{\'Initial Data\' | formioTranslate}}</label>' +
           '<table class="table table-condensed">' +
            '<thead>' +
               '<tr>' +
                 '<th class="col-xs-4">{{\'Name\' | formioTranslate}}</th>' +
                 '<th class="col-xs-3">{{\'Type\' | formioTranslate}}</th>' +
                 '<th class="col-xs-4">{{\'Value\' | formioTranslate}}</th>' +
                 '<th class="col-xs-1"></th>' +
               '</tr>' +
            '</thead>' +
            '<tbody>' +
             '<tr ng-repeat="column in component.flowData">' +
               '<td class="col-xs-4"><input type="text" class="form-control" ng-model="column.name"/></td>' +
               '<td class="col-xs-3"><select class="form-control" id="variableType" name="variableType" ng-options="opp for opp in component.variableType" ng-model="column.type"></select></td>' +
               '<td class="col-xs-4"><input type="text" class="form-control" ng-model="column.value"/></td>' +
               '<td class="col-xs-1"><button type="button" class="btn btn-danger btn-xs" ng-click="removeColumn($index)" tabindex="-1"><span class="glyphicon glyphicon-remove-circle"></span></button></td>' +
             '</tr>' +
            '</tbody>' +
           '</table>' +
           '<button type="button" class="btn btn-default" ng-click="addColumn()">{{\'Add Variable\' | formioTranslate}}</button>' +
         '</div>' +
       '</ng-form>'
       );
    }
  ]);
};
