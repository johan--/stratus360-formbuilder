module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    function(
      formioComponentsProvider
    ) {
      formioComponentsProvider.register('flowbutton', {
        title: 'Flow Button',
        template: 'formio/components/flowbutton.html',
        group: 'advanced',
        settings: {
          input: false,
          label: 'Flow Button',
          actionType: '',
          availableActionType: [
            {label: 'Pass Data Only', value: 'pass_data_only'},
            {label: 'Save Only', value: 'save_only'},
            {label: 'Save and Pass Data', value: 'save_and_pass'}
          ],
          dataToPass: '',
          availableDataToPass: [
            {label: 'All', value: 'all'},
            {label: 'Custom', value: 'custom'}
          ],
          inputFields: [],
          selectedInputFields: [],
        },
        viewTemplate: 'formio/componentsView/flowbutton.html',
        fbtemplate: 'formio/formbuilder/flowbutton.html',
        icon: 'fa fa-arrows-h',
        views: [
          {
            name: 'FLOW CONFIG',
            template: 'formio/components/flowbutton/flowconfig.html'
          },
          {
            name: 'API',
            template: 'formio/components/common/api.html'
          }
        ],
        onEdit: ['$scope', function($scope) {
          $scope.refreshField = function() {
            debugger;
            var rootScope = $scope.findTheRoot($scope);
            var inputFields = [];

            if(rootScope.form){
              inputFields = $scope.findInputTypeField(rootScope.form); 
            }
            debugger;

            $scope.component.inputFields = inputFields;
          };

          $scope.findTheRoot = function(scope){
            if(scope.rootList){
              return scope;
            }else{
              return $scope.findTheRoot(scope['$parent']);
            }
          };

          $scope.findInputTypeField = function(components){
            var fields = [];
            components.components.forEach(function(cmp){
                if(cmp.type == 'columns'){
                    cmp.columns.forEach(function(col){
                        fields = fields.concat($scope.findInputTypeField(col));
                    });
                }else if(cmp.type == 'fieldset' || cmp.type == 'well' || cmp.type == 'panel'){
                    fields = fields.concat($scope.findInputTypeField(cmp));
                }else if(cmp.input){
                    fields.push(cmp.key);
                }
            });

            return fields;
          };

        }],
      });
    }
  ]);
  app.run([
    '$rootScope',
    '$templateCache',
    function($rootScope, $templateCache) {
      $templateCache.put('formio/components/flowbutton.html',
                               '<a href="#" class="btn btn-primary"><i class="fa fa-print"></i> {{component.label}}</a>'
                              );
            
            $templateCache.put('formio/componentsView/flowbutton.html',
                               '<a href="#" class="btn btn-primary"><i class="fa fa-print"></i> {{component.label}}</a>'
                              );
            
            $templateCache.put('formio/formbuilder/flowbutton.html',
                               '<a href="#" class="btn btn-primary"><i class="fa fa-print"></i> {{component.label}}</a>'
                              );
       $templateCache.put('formio/components/flowbutton/flowconfig.html',
          '<ng-form>' +
          ' <div class="form-group">' +
          '   <label form-builder-tooltip="Action that will do by this flow screen">{{\'Screen Action\' | formioTranslate}}</label><br/>' +
          '   <label>' +
          '     <input type="radio" ng-model="component.actionType" ng-value="component.availableActionType[0].value">' +
          '     {{component.availableActionType[0].label | formioTranslate}}'+
          '   </label><br/>'+
          '   <label>' +
          '     <input type="radio" ng-model="component.actionType" ng-value="component.availableActionType[1].value">' +
          '     {{component.availableActionType[1].label | formioTranslate}}'+
          '   </label><br/>'+
          '   <label>' +
          '     <input type="radio" ng-model="component.actionType" ng-value="component.availableActionType[2].value">' +
          '     {{component.availableActionType[2].label | formioTranslate}}'+
          '   </label><br/>'+
          ' </div>' +
          ' <div class="form-group" ng-if="component.actionType == \'pass_data_only\' || component.actionType == \'save_and_pass\'">' +
          '   <label form-builder-tooltip="Which data you want to pass through">{{\'Data to Pass\' | formioTranslate}}</label><br/>' +
          '   <label>' +
          '     <input type="radio" ng-model="component.dataToPass" ng-value="component.availableDataToPass[0].value">' +
          '     {{component.availableDataToPass[0].label | formioTranslate}}'+
          '   </label><br/>'+
          '   <label>' +
          '     <input type="radio" ng-model="component.dataToPass" ng-value="component.availableDataToPass[1].value">' +
          '     {{component.availableDataToPass[1].label | formioTranslate}}'+
          '   </label><br/>'+
          ' </div>' +
          ' <div class="form-group" ng-if="(component.actionType == \'pass_data_only\' || component.actionType == \'save_and_pass\') && component.dataToPass == \'custom\'">' +
          '   <label form-builder-tooltip="Which field you want to pass through">{{\'Field to Pass\' | formioTranslate}}</label>' +
          '   <button type="button" class="btn btn-default" ng-click="refreshField()">{{\'Refresh\' | formioTranslate}}</button>' +
          '   <select class="form-control" id="inputSelect" name="inputSelect" ng-options="f for f in component.inputFields" ng-model="component.selectedInputFields" multiple>'+
          ' </div>' +
          '</ng-form>'
        );
    }
  ]);
};
