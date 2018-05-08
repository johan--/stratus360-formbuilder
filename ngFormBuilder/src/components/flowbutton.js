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
          flows: {
            '123': {name:'docx1', returnedFlowField: ['firstname', 'lastname']},
            '124': {name:'saveDoc', returnedFlowField: ['address', 'hobby']}
          },
          selectedFlow: '',
          inputFlowMap: {},
          refreshListFlowCallback: undefined,
          refreshFlowButtonLabel: 'Refresh Flow'
        },
        viewTemplate: 'formio/componentsView/flowbutton.html',
        fbtemplate: 'formio/formbuilder/flowbutton.html',
        icon: 'fa fa-arrows-h',
        views: [
          {
            name: 'INPUT CONFIG',
            template: 'formio/components/flowbutton/inputconfig.html'
          },
          {
            name: 'OUTPUT CONFIG',
            template: 'formio/components/flowbutton/outputconfig.html'
          },
          {
            name: 'API',
            template: 'formio/components/common/api.html'
          }
        ],
        onEdit: ['$scope', function($scope) {
          $scope.refreshField = function() {
            var rootScope = $scope.findTheRoot($scope);
            var inputFields = [];

            if(rootScope.form){
              inputFields = $scope.findInputTypeField(rootScope.form);
            }

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

          $scope.onSelectedFlowChange = function(){
            debugger;
          };

          $scope.refreshListFlow = function(){
            if($scope.component.refreshListFlowCallback){
              $scope.component.refreshListFlowCallback($scope);
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
      $templateCache.put('formio/components/flowbutton.html',
                               '<a href="#" class="btn btn-primary"><i class="fa fa-print"></i> {{component.label}}</a>'
                              );

            $templateCache.put('formio/componentsView/flowbutton.html',
                               '<a href="#" class="btn btn-primary"><i class="fa fa-print"></i> {{component.label}}</a>'
                              );

            $templateCache.put('formio/formbuilder/flowbutton.html',
                               '<a href="#" class="btn btn-primary"><i class="fa fa-print"></i> {{component.label}}</a>'
                              );

        $templateCache.put('formio/components/flowbutton/inputconfig.html',
          '<ng-form>' +
          ' <div class="form-group">' +
          '   <label form-builder-tooltip="Maps the input from other flow">{{\'Map Flow Input\' | formioTranslate}}</label>' +
          '   <table class="table table-condensed">' +
          '     <thead>' +
          '       <tr>' +
          '         <th class="col-xs-6"><button type="button" class="btn btn-default" ng-click="refreshListFlow()">{{component.refreshFlowButtonLabel | formioTranslate}}</button></th>' +
          '         <th class="col-xs-6"><button type="button" class="btn btn-default" ng-click="refreshField()">{{\'Refresh\' | formioTranslate}}</button></th>' +
          '       </tr>' +
          '       <tr>' +
          '         <th class="col-xs-6">'+
          '           <select class="form-control" ng-model="component.selectedFlow" ng-change="onSelectedFlowChange()">'+
          '             <option ng-repeat="(key, value) in component.flows" value="{{key}}">{{value.name}}</option>'+
          '           </select>' +
          '         </th>' +
          '         <th class="col-xs-6">'+
          '         </th>' +
          '       </tr>' +
          '       <tr>' +
          '         <th class="col-xs-6">'+
          '           Returned Flow Fields' +
          '         </th>' +
          '         <th class="col-xs-6">'+
          '           Current Form Fields' +
          '         </th>' +
          '       </tr>' +
          '     </thead>' +
          '     <tbody>' +
          '       <tr ng-repeat="row in component.flows[component.selectedFlow].returnedFlowField">' +
          '         <td class="col-xs-6">'+
          '           <label>{{row}}</label>' +
          '         </td>' +
          '         <td class="col-xs-6">'+
          '           <select class="form-control" ng-options="f for f in component.inputFields" ng-model="component.inputFlowMap[component.selectedFlow][row]">'+
          '         </td>' +
          '       </tr>' +
          '     </tbody>' +
          '   </table>' +
          ' </div>' +
          '</ng-form>'
        );

       $templateCache.put('formio/components/flowbutton/outputconfig.html',
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
