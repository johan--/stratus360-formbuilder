module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    'FORM_OPTIONS',
    function(
      formioComponentsProvider,
      FORM_OPTIONS
    ) {
      formioComponentsProvider.register('button', {
        onEdit: ['$scope', function($scope) {
          $scope.actions = FORM_OPTIONS.actions;
          $scope.sizes = FORM_OPTIONS.sizes;
          $scope.themes = FORM_OPTIONS.themes;
        }],
        icon: 'fa fa-stop',
        views: [
          {
            name: 'Display',
            template: 'formio/components/button/display.html'
          },
          {
            name: 'API',
            template: 'formio/components/button/api.html'
          },
          {
            name: 'Action',
            template: 'formio/components/tool/action.html'
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
        settings: {
          errorMessage: '',
          successMessage: '',
          label: 'Button',
          /**
                     * my custom definition
                     */
                     actions: [
                     {
                      name: 'standard',
                      title: 'Standard'
                    },
                    {
                      name: 'custom',
                      title: 'Custom'
                    },
                    ],

                    standardActions: [
                    {
                      name: 'show',
                      title: 'Show'
                    },
                    {
                      name: 'hide',
                      title: 'Hide'
                    },
                    {
                      name: 'toggleShowHide',
                      title: 'Toggle Show Hide'
                    },
                    {
                      name: 'next',
                      title: 'Next'
                    },
                    {
                      name: 'previous',
                      title: 'Previous'
                    },
                    {
                      name: 'redirect',
                      title: 'Redirect'
                    },
                    {
                      name: 'submit',
                      title: 'Submit'
                    },
                    ],

                    submitSuccess: false,
                    submitFailed: false,
                    submitRedirect: false,



                    action:'',
                    event:'',
                    target: '',
                    redirectUri: '',
                    redirectTarget:'',
                    submitSuccessCallback: '',
                    submitFailedCallback: '',

                    /**
                     *end of my custom definition
                     */
        },
        onEdit: ['$scope', function($scope) {
                  $scope.toggle = function(index) {
                    switch(index){
                      case 0:
                        $scope.component.submitSuccess = !$scope.component.submitSuccess;
                        $scope.component.submitRedirect = false;
                        break;
                      case 1:
                        $scope.component.submitFailed = !$scope.component.submitFailed;
                        $scope.component.submitRedirect = false;
                        break;
                      case 2:
                        $scope.component.submitRedirect = !$scope.component.submitRedirect;
                        $scope.component.submitSuccess = false;
                        $scope.component.submitFailed = false;
                        break;
                    }
                  };
                }],
        documentation: 'http://help.form.io/userguide/#button'
      });
    }
  ]);
  app.run([
    '$templateCache',
    function($templateCache) {
      // Create the settings markup.
      $templateCache.put('formio/components/button/display.html',
        '<ng-form>' +
          '<form-builder-option property="label"></form-builder-option>' +
          /*'<div class="form-group">' +
            '<label for="action" form-builder-tooltip="This is the action to be performed by this button.">{{\'Action\' | formioTranslate}}</label>' +
            '<select class="form-control" id="action" name="action" ng-options="action.name as action.title | formioTranslate for action in actions" ng-model="component.action"></select>' +
          '</div>' +
          '<div class="form-group" ng-if="component.action === \'event\'">' +
          '  <label for="event" form-builder-tooltip="The event to fire when the button is clicked.">{{\'Button Event\' | formioTranslate}}</label>' +
          '  <input type="text" class="form-control" id="event" name="event" ng-model="component.event" placeholder="event" />' +
          '</div>' +
        '<div class="form-group" ng-if="component.action === \'url\'">' +
        '  <label for="event" form-builder-tooltip="Place an Url where the submission will be sent.">{{\'Button Url\'' +
        ' | formioTranslate}}</label>' +
        '  <input type="url" class="form-control" id="event" name="event" ng-model="component.url"' +
        ' placeholder="URL: https://example.form.io" />' +
        '</div>' +
        '<headers-builder ng-if="component.action === \'url\'" form="form" component="component"' +
        ' data="component.headers" label="Headers" tooltip-text="Headers Properties' +
        ' and Values for your request."></headers-builder>' +
          '<div class="form-group" ng-if="component.action === \'custom\'">' +
          '  <label for="custom" form-builder-tooltip="The custom logic to evaluate when the button is clicked.">{{\'Button Custom Logic\' | formioTranslate}}</label>' +*/
          //'  <formio-script-editor rows="10" id="custom" name="custom" ng-model="component.custom" placeholder="/*** Example Code ***/\ndata[\'mykey\'] = data[\'anotherKey\'];"></formio-script-editor>' +
          //'</div>' +
          /*'<div class="form-group">' +
            '<label for="theme" form-builder-tooltip="The color theme of this panel.">{{\'Theme\' | formioTranslate}}</label>' +
            '<select class="form-control" id="theme" name="theme" ng-options="theme.name as theme.title | formioTranslate for theme in themes" ng-model="component.theme"></select>' +
          '</div>' +
          '<div class="form-group">' +
            '<label for="size" form-builder-tooltip="The size of this button.">{{\'Size\' | formioTranslate}}</label>' +
            '<select class="form-control" id="size" name="size" ng-options="size.name as size.title | formioTranslate for size in sizes" ng-model="component.size"></select>' +
          '</div>' +
          '<form-builder-option property="leftIcon"></form-builder-option>' +
          '<form-builder-option property="rightIcon"></form-builder-option>' +
          '<form-builder-option property="tooltip"></form-builder-option>' +
          '<form-builder-option-shortcut></form-builder-option-shortcut>' +*/
          '<form-builder-option property="successMessage"></form-builder-option>' +
          '<form-builder-option property="errorMessage"></form-builder-option>' +
          '<form-builder-option property="customClass"></form-builder-option>' +
          /*'<form-builder-option property="tabindex"></form-builder-option>' +
          '<form-builder-option property="block"></form-builder-option>' +
        '<form-builder-option property="autofocus" type="checkbox" label="Add autofocus" tooltip="Set autofocus attribute to the field"></form-builder-option>' +
          '<form-builder-option property="disableOnInvalid"></form-builder-option>' +*/
        '</ng-form>'
      );


      $templateCache.put('formio/components/button/api.html',
        '<ng-form>' +
          '<form-builder-option-key></form-builder-option-key>' +
        '</ng-form>'
      );


      $templateCache.put('formio/components/tool/action.html',
                               '<ng-form>' +
                               '<div class="form-group">' +
                               '<label for="action" form-builder-tooltip="This is the action to be performed by this button.">{{\'Action\' | formioTranslate}}</label>' +
                                '<select class="form-control" id="action" name="action" ng-options="action.name as action.title | formioTranslate for action in component.actions" ng-model="component.action"></select>' +
                               '</div>' +

                                // if standard action
                                '<div class="form-group" ng-if="component.action === \'standard\'">' +
                                '<label for="standard" form-builder-tooltip="This is the standard action.">{{\'Standard Action\' | formioTranslate}}</label>' +
                                '<select class="form-control" id="standard" name="standard" ng-options="action.name as action.title | formioTranslate for action in component.standardActions" ng-model="component.event"></select>' +
                                '</div>' +

                                // for standard action->standard event
                                '<div class="form-group" ng-if="component.action === \'standard\' && component.event != \'\' && component.event != \'submit\' && component.event != \'redirect\'">' +
                                '  <label for="target" form-builder-tooltip="The target action">{{\'Action Target\' | formioTranslate}}</label>' +
                                '  <input type="text" class="form-control" id="target" name="target" ng-model="component.target" placeholder="Action Target" />' +
                                '</div>' +

                                // for standard action->submit event
                                '<div class="form-group" ng-if="component.action === \'standard\' && component.event === \'submit\'">' +
                                ' <label for="target" form-builder-tooltip="The target action">{{\'Submit Callback\' | formioTranslate}}</label>' +
                                ' <div class="form-control">'+
                                '   <input type="checkbox" ng-click="toggle(0)" ng-checked="component.submitSuccess"><span>Success Callback</span></input>'+
                                '   <input type="checkbox" ng-click="toggle(1)" ng-checked="component.submitFailed"><span>Failed Callback</span></input>'+
                                '   <input type="checkbox" ng-click="toggle(2)" ng-checked="component.submitRedirect"><span>Redirect</span></input>'+
                                ' </div>' +
                                '</div>' +

                                // for standard action->redirect event or submit event with redirect
                                '<div class="form-group" ng-if="component.action === \'standard\' && (component.event === \'redirect\' || (component.event === \'submit\' && component.submitRedirect == true))">' +
                                '  <label for="redirectUri" form-builder-tooltip="Redirect URL">{{\'Redirect URL\' | formioTranslate}}</label>' +
                                '  <input type="text" class="form-control" id="redirectUri" name="redirectUri" ng-model="component.redirectUri" placeholder="Redirect URL" />' +
                                '</div>' +

                                '<div class="form-group" ng-if="component.action === \'standard\' && component.event === \'redirect\' || (component.action === \'standard\' && component.event === \'submit\' && component.submitRedirect == true)">' +
                                '  <label for="redirectTarget" form-builder-tooltip="Redirect Target">{{\'Redirect Target\' | formioTranslate}}</label>' +
                                '  <select class="form-control" id="redirectTarget" name="redirectTarget" ng-options="t for t in [\'_self\', \'_blank\']" ng-model="component.redirectTarget"></select>' +
                                '</div>' +

                                // if submitSuccessCallback 
                                '<div class="form-group" ng-if="component.action === \'standard\' && component.event === \'submit\' && component.submitSuccess === true">' +
                                '  <label for="submitSuccessCallback" form-builder-tooltip="The custom logic to evaluate when success submit.">{{\'Success Callback Logic\' | formioTranslate}}</label>' +
                                '  <formio-script-editor rows="3" id="submitSuccessCallback" name="submitSuccessCallback" ng-model="component.submitSuccessCallback" placeholder=""></formio-script-editor>' +
                                '</div>' +
                               '</ng-form>' +

                               // if submitFailedCallback 
                                '<div class="form-group" ng-if="component.action === \'standard\' && component.event === \'submit\' && component.submitFailed === true">' +
                                '  <label for="submitFailedCallback" form-builder-tooltip="The custom logic to evaluate when success submit.">{{\'Failed Callback Logic\' | formioTranslate}}</label>' +
                                '  <formio-script-editor rows="3" id="submitFailedCallback" name="submitFailedCallback" ng-model="component.submitFailedCallback" placeholder=""></formio-script-editor>' +
                                '</div>' +
                               '</ng-form>' +

                                // if custom action
                                '<div class="form-group" ng-if="component.action === \'custom\'">' +
                                '  <label for="custom" form-builder-tooltip="The custom logic to evaluate when the button is clicked.">{{\'Button Custom Logic\' | formioTranslate}}</label>' +
                                '  <formio-script-editor rows="3" id="custom" name="custom" ng-model="component.custom" placeholder=""></formio-script-editor>' +
                                '</div>' +
                               '</ng-form>'
                              );
    }
  ]);
};
