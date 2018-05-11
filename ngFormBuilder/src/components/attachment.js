module.exports = function (app) {
    app.config([
        'formioComponentsProvider',
        function (
            formioComponentsProvider
        ) {
            formioComponentsProvider.register('attachment', {
                title: 'attachment',
                template: 'formio/components/attachment.html',
                group: 'advanced',
                settings: {
                    message:'attachment',
                    label: 'attachment',
                    input: false,
                    dependents: [],
                },
                viewTemplate: 'formio/componentsView/attachment.html',
                onEdit: ['$scope', function ($scope) {
                    $scope.removeColumn = function (index) {
                        $scope.component.dependents.splice(index, 1);
                    };
                    $scope.addColumn = function () {
                        $scope.component.dependents.push({});
                    };
                }],
                fbtemplate: 'formio/formbuilder/attachment.html',
                icon: 'fa fa-paperclip',
                views: [
                    {
                        name: 'Display',
                        template: 'formio/components/attachment/display.html'
                    }
                ]
            });
        }
    ]);
    app.run([
        '$templateCache',
        function ($templateCache) {
            $templateCache.put('formio/components/attachment.html',
                '<div class="btn-group btn-group-toggle" data-toggle="buttons">' +
                '<label class="btn btn-secondary">' +
                '<input type="radio" name="options" id="Yes" autocomplete="off"> Yes' +
                '</label>' +
                '<label class="btn btn-secondary">' +
                '<input type="radio" name="options" id="No" autocomplete="off"> No' +
                '</label>' +
                '</div>' +
                '<div class="form-group">' +
                '<button type="button" class="btn btn-primary btn-block" style = "white-space: normal;">{{component.label}} Attachment</button>' +
                '</div>'
            );

            $templateCache.put('formio/componentsView/attachment.html',
                '<div class="btn-group btn-group-toggle" data-toggle="buttons">' +
                '<label class="btn btn-secondary">' +
                '<input type="radio" name="options" id="Yes" autocomplete="off"> Yes' +
                '</label>' +
                '<label class="btn btn-secondary">' +
                '<input type="radio" name="options" id="No" autocomplete="off"> No' +
                '</label>' +
                '</div>' +
                '<div class="form-group">' +
                '<button type="button" class="btn btn-primary btn-block" style = "white-space: normal;">{{component.label}} Attachment</button>' +
                '</div>'
            );

            $templateCache.put('formio/formbuilder/attachment.html',
                '<div class="btn-group btn-group-toggle" data-toggle="buttons">' +
                '<label class="btn btn-secondary">' +
                '<input type="radio" name="options" id="Yes" autocomplete="off"> Yes' +
                '</label>' +
                '<label class="btn btn-secondary">' +
                '<input type="radio" name="options" id="No" autocomplete="off"> No' +
                '</label>' +
                '</div>' +
                '<div class="form-group">' +
                '<button type="button" class="btn btn-primary btn-block" style = "white-space: normal;">{{component.label}} Attachment</button>' +
                '</div>'
            );

            $templateCache.put('formio/components/attachment/display.html',
                '<ng-form>' +

                '<div class="form-group">' +
                '<label for="Name" form-builder-tooltip="This is the action to be performed by this button.">{{\'Enter Message You Want to Display\' | formioTranslate}}</label>' +
                '<input id="label" name="label" type="text" ng-model="component.message" placeholder="Field Name" property="example" label-validator="" required="required" class="form-control ng-pristine ng-valid ng-not-empty ng-valid-required ng-touched">' +
                '</div>' +

                '<div class="form-group">' +
                '<label for="Name" form-builder-tooltip="This is the action to be performed by this button.">{{\'Field Name for Attachment\' | formioTranslate}}</label>' +
                '<input id="label" name="label" type="text" ng-model="component.label" placeholder="Field Name" property="example" label-validator="" required="required" class="form-control ng-pristine ng-valid ng-not-empty ng-valid-required ng-touched">' +
                '</div>' +


                '</ng-form>'
            );

        }
    ]);
};
