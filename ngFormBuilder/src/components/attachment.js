module.exports = function (app) {
    app.config([
        'formioComponentsProvider',
        function (
            formioComponentsProvider
        ) {
            formioComponentsProvider.register('attachment', {
                title: 'Field Attachment',
                template: 'formio/components/attachment.html',
                group: 'advanced',
                settings: {
                    message:'attachment',
                    label: 'attachment',
                    input: false,
                },
                viewTemplate: 'formio/componentsView/attachment.html',

                fbtemplate: 'formio/formbuilder/attachment.html',
                icon: 'fa fa-paperclip',
                views: [
                    {
                        name: 'Display',
                        template: 'formio/components/attachment/display.html'
                    },
                    {
                        name: 'Validation',
                        template: 'formio/components/attachment/validate.html'
                    },
                ]
            });
        }
    ]);
    app.run([
        '$templateCache',
        function ($templateCache) {
            $templateCache.put('formio/components/attachment.html',
                '<p><b>{{component.message}}</b></p>'+
                '<table>'+
                '<td width=60px>'+
                '<input type="radio" id="contactChoice1" name="options">'+
                '    <label for="contactChoice1">Yes</label>'+
                '</td> '+
                '<td width=60px>'+
                '<input type="radio" id="contactChoice2" name="options">'+
                '    <label for="contactChoice1">No</label>'+
                '</td>'+
                '</table>'
            );

            $templateCache.put('formio/componentsView/attachment.html',
                '<p><b>{{component.message}}</b></p>'+
                '<table>'+
                '<td width=60px>'+
                '<input type="radio" id="contactChoice1" name="options">'+
                '    <label for="contactChoice1">Yes</label>'+
                '</td> '+
                '<td width=60px>'+
                '<input type="radio" id="contactChoice2" name="options">'+
                '    <label for="contactChoice1">No</label>'+
                '</td>'+
                '</table>'
            );

            $templateCache.put('formio/formbuilder/attachment.html',
                '<button type="button" class="btn btn-primary btn-block" style = "white-space: normal;">{{component.label}} Attachment Form</button>'
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

                '<div class="form-group">' +
                '<label for="Name" form-builder-tooltip="This is the action to be performed by this button.">{{\'Object that you want to Bind to\' | formioTranslate}}</label>' +
                '<input id="label" name="label" type="text" ng-model="component.master" placeholder="Field Name" property="example" label-validator="" required="required" class="form-control ng-pristine ng-valid ng-not-empty ng-valid-required ng-touched">' +
                '</div>' +

                '</ng-form>'
            );

            // Create the Validation markup.
            $templateCache.put('formio/components/attachment/validate.html',
                '<ng-form>' +
                '<form-builder-field-attachment-validation></form-builder-field-attachment-validation>' +
                '<form-builder-option-custom-validation></form-builder-option-custom-validation>' +
                '</ng-form>'
                );

        }
    ]);
};
