module.exports = function(app) {
    app.config([
      'formioComponentsProvider',
      function(
        formioComponentsProvider
      ) {
        formioComponentsProvider.register('progress', {
          title: 'Progress',
          template: 'formio/components/progress.html',
          group: 'advanced',
          settings: {
            name:'progress',
            input: false,
            dependents: [],
          },
          viewTemplate: 'formio/componentsView/progress.html',
          onEdit: ['$scope', function($scope) {
            $scope.removeColumn = function(index) {
              $scope.component.dependents.splice(index, 1);
            };
            $scope.addColumn = function() {
              $scope.component.dependents.push({});
            };
          }],
          fbtemplate: 'formio/formbuilder/progress.html',
          icon: 'fa fa-chart-bar',
          views: [
          {
            name: 'Display',
            template: 'formio/components/progress/display.html'
          }
          ]  
        });
      }
    ]);
    app.run([
      '$templateCache',
      function($templateCache) {
        $templateCache.put('formio/components/progress.html',
        '<div class="form-group>' +
        '<img src="../../images/path-slds.png/>'+
        '</div>'
         );
  
        $templateCache.put('formio/componentsView/progress.html',
        '<div class="form-group>' +
        '<img src="../../images/path-slds.png/>'+
        '</div>'
         );
  
        $templateCache.put('formio/formbuilder/progress.html',
        '<div class="form-group>' +
        '<img src="../../images/path-slds.png/>'+
        '</div>'
         );
  
        $templateCache.put('formio/components/progress/display.html',
         '<ng-form>' +
            '<div class="form-group">' +
            '<label for="Name" form-builder-tooltip="This is the action to be performed by this button.">{{\'Name\' | formioTranslate}}</label>' +
            '<input id="label" name="label" type="text" ng-model="component.label" placeholder="Name" property="example" label-validator="" required="required" class="form-control ng-pristine ng-valid ng-not-empty ng-valid-required ng-touched">' +
            '</div>' +
           '<div class="form-group">' +
             '<label form-builder-tooltip="The width, offset, push and pull settings for the columns">{{\'Attributes\' | formioTranslate}}</label>' +
             '<table class="table table-condensed">' +
              '<thead>' +
                 '<tr>' +
                   '<th class="col-xs-2">{{\'Field (API Name)\' | formioTranslate}}</th>' +
                   '<th class="col-xs-2">{{\'Display Caption\' | formioTranslate}}</th>' +
                   '<th class="col-xs-1"></th>' +
                 '</tr>' +
              '</thead>' +
              '<tbody>' +
               '<tr ng-repeat="column in component.dependents">' +
                 '<td class="col-xs-2"><input type="text" class="form-control" ng-model="column.field"/></td>' +
                 '<td class="col-xs-2"><input type="text" class="form-control" ng-model="column.value"/></td>' +
                 '<td class="col-xs-1"><button type="button" class="btn btn-danger btn-xs" ng-click="removeColumn($index)" tabindex="-1"><span class="glyphicon glyphicon-remove-circle"></span></button></td>' +
               '</tr>' +
              '</tbody>' +
             '</table>' +
             '<button type="button" class="btn btn-default" ng-click="addColumn()">{{\'Add Dependent\' | formioTranslate}}</button>' +
           '</div>' +
         '</ng-form>'
         );
         
      }
    ]);
  };
  