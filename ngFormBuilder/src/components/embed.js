module.exports = function(app) {
    app.config([
      'formioComponentsProvider',
      function(
        formioComponentsProvider
      ) {
        formioComponentsProvider.register('embed', {
          title: 'embed',
          template: 'formio/components/embed.html',
          group: 'advanced',
          settings: {
            input: false,
            dependents: [],
          },
          viewTemplate: 'formio/componentsView/embed.html',
          onEdit: ['$scope', function($scope) {
            $scope.removeColumn = function(index) {
              $scope.component.dependents.splice(index, 1);
            };
            $scope.addColumn = function() {
              $scope.component.dependents.push({});
            };
          }],
          fbtemplate: 'formio/formbuilder/embed.html',
          icon: 'fa fa-search',
          views: [
          {
            name: 'Display',
            template: 'formio/components/embed/display.html'
          },
          {
            name: 'API',
            template: 'formio/components/embed/api.html'
          }
          ]  
        });
      }
    ]);
    app.run([
      '$templateCache',
      function($templateCache) {
        $templateCache.put('formio/components/embed.html',
         '<div class="form-group">' +
          '<button type="button" class="btn btn-primary btn-block">{{component.label}} Custom Component</button>'+
         '</div>'
         );
  
        $templateCache.put('formio/componentsView/embed.html',
         '<div class="form-group">' +
          '<button type="button" class="btn btn-primary btn-block">{{component.label}} Custom Component</button>'+
         '</div>'
         );
  
        $templateCache.put('formio/formbuilder/embed.html',
         '<div class="form-group">' +
          '<button type="button" class="btn btn-primary btn-block">{{component.label}} Custom Component</button>'+
         '</div>'
         );
  
        $templateCache.put('formio/components/embed/display.html',
         '<ng-form>' +
            '<div class="form-group">' +
            '<label for="Name" form-builder-tooltip="This is the action to be performed by this button.">{{\'Name\' | formioTranslate}}</label>' +
            '<input id="label" name="label" type="text" ng-model="component.label" placeholder="Name" property="example" label-validator="" required="required" class="form-control ng-pristine ng-valid ng-not-empty ng-valid-required ng-touched">' +
            '</div>' +
           '<div class="form-group">' +
             '<label form-builder-tooltip="The width, offset, push and pull settings for the columns">{{\'Dependent Field\' | formioTranslate}}</label>' +
             '<table class="table table-condensed">' +
              '<thead>' +
                 '<tr>' +
                   '<th class="col-xs-2">{{\'Field\' | formioTranslate}}</th>' +
                   '<th class="col-xs-2">{{\'Value\' | formioTranslate}}</th>' +
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
         
         $templateCache.put('formio/components/embed/api.html',
          '<ng-form>' +
            '<form-builder-option-key></form-builder-option-key>' +
          '</ng-form>'
       );
      }
    ]);
  };
  