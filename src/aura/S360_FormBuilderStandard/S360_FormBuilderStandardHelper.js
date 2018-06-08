({
	generateForm : function(component, event, config) {
        component.set('v.FormPattern', this.mappingThePattern(component, config));
        debugger;
        var self = this;
        config.forEach(function(item){
            //debugger;
            console.log(item.key);

            self.generatorMapping(component, item);
        });
	},

    callbackHandler: function(config, component, newComponent, status, errorMessage){
        var formPattern = component.get('v.FormPattern');
        var configKey = config['$$hashKey']+''+config['key'];
        var patternObj = formPattern[configKey];
        var self = this;

        // check do this object has a parent, if doesn't put this object to the outmost component
        // else check is this object's parent has been created, if yes, put this object to its parent

        if(patternObj.parent == undefined){
            var body = component.get("v.body");

            newComponent.indexInParent = patternObj.indexInParent;

            body = self.pushAndSortMappingConfig(newComponent, body);

            component.set("v.body", body);
        }else if(formPattern[patternObj.parent].body != undefined){
            var parentComp = formPattern[patternObj.parent].body;
            var body = parentComp.get("v.body");

            // set index in parent in new created component base on pattern mapping
            newComponent.indexInParent = patternObj.indexInParent;

            body = self.pushAndSortMappingConfig(newComponent, body);

            parentComp.set("v.body", body);
        }

        // check do this object has childs, if do. put all childs to it
        if(patternObj.child != undefined){
            //var childBodies = [];
            var body = newComponent.get('v.body');

            for(var key in patternObj.child){
                if(patternObj.child.hasOwnProperty(key)){
                    var child = formPattern[patternObj.child[key].key];
                    // if the child has been created, push it to parent
                    if(child.body != undefined){
                        // set index in parent in child of not set before
                        if(child.body.indexInParent == undefined){
                         	child.body.indexInParent = child.indexInParent;
                        }

                        body = self.pushAndSortMappingConfig(child.body, body);
                        //childBodies.push(child.body);
                    }
                }
            }


            //body = body.concat(childBodies);
            newComponent.set('v.body', body);
        }

        //update pattern object
        patternObj.body = newComponent;
        formPattern[configKey] = patternObj;
        component.set('v.FormPattern', formPattern);

        // set component data
        var componentData = component.get('v.componentData');
        if(componentData == undefined || componentData == null || componentData == ''){
            componentData = {};
        }

        if(config.key != undefined){
        	componentData[newComponent.getLocalId()] = newComponent;
        	component.set('v.componentData', componentData);
        }


    },

    /*
     * function : router function to determmine what type of component will
     * 				displayed or created
     *
     */
    generatorMapping: function(component, item){
        var formPattern = component.get('v.FormPattern');

        if(item.type === 'textfield'){
            this.generateTextField(component, item);
        }else if(item.type === 'columns'){
            this.generateColumn(component, item);
        }else if(item.type === 'htmlelement'){
            this.generateHtmlElement(component, item);
        }else if(item.type === 'button'){
            this.generateButton(component, item);
        }else if(item.type === 'number'){
            this.generateInputNumber(component, item);
        }else if(item.type === 'password'){
            this.generateInputSecret(component, item);
        }else if(item.type === 'checkbox'){
            this.generateCheckbox(component, item);
        }else if(item.type === 'select'){
            this.generateInputSelect(component, item);
        }else if(item.type === 'well'){
            this.generateDiv(component, item);
        }else if(item.type === 'fieldset'){
            this.generateCard(component, item);
        }else if(item.type === 'panel'){
            this.generatePanel(component, item);
        }else if(item.type === 'container'){
            this.generateRelatedList(component, item);
        }else if(item.type === 'hidden'){
            this.generateHidden(component, item);
        }else if(item.type === 'datetime'){
            this.generateDateTime(component, item);
        }else if(item.type === 'file'){
            this.generateInputFile(component, item);
        }else if(item.type === 'captcha'){
            this.generateCaptcha(component, item);
        }else if(item.type === 'lookup'){
            this.generateLookup(component, item);
        }else if(item.type === 'signature'){
            this.generateSignature(component, item);
        }else if(item.type === 'carousel'){
            this.generateCarousel(component, item);
        }else if(item.type === 'email'){
            this.generateInputEmail(component, item);
        }else if(item.type === 'phoneNumber'){
            this.generateInputPhoneNumber(component, item);
        }else if(item.type === 'buttonprint'){
            this.generateButtonPrint(component, item);
        }else if(item.type === 'lightningflow'){
            this.generateLightningFlow(component, item);
        }else if(item.type === 'flowbutton'){
            this.generateLightningFlowButton(component, item);
        }else if(item.type == undefined && formPattern[item['$$hashKey']+''+item['key']].type === 'column_item'){
            this.generateColumnItem(component, item);
        }else if(item.type === 'embed'){
            this.generateLightningEmbedded(component, item);
        }else if(item.type === 'attachment'){
            this.generateAttachment(component, item);
        }
    },

    /*
     * Function : display text input
     *
     *
     */
    generateTextField : function(component, config){
        var serverFieldInfo = component.get('v.FieldInfo');
        var self = this;

        // set value and get it reference
        component.set('v.Data['+ config.key +']',
                      component.get('v.Data') ? (component.get('v.Data')[config.key] ? component.get('v.Data')[config.key] : undefined) : undefined);
        var value = component.getReference('v.Data['+ config.key +']');

        // add to temporary flow data
        this.add2TmpFlowData(component, config.key, value);

        $A.createComponent(
            'c:S360_Base_InputTextCmp',
            {
                "aura:id": config.key,
                "CompId": config.key,
                "InputLabel": config.label ? config.label : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].label ? serverFieldInfo[config.key].label : '') : ''),
                "HelpText": config.tooltip ? config.tooltip : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].helpText ? serverFieldInfo[config.key].helpText : '') : ''),
                "PlaceholderText": config.placeholder ? config.placeholder : '',
                "IsHidden": serverFieldInfo[config.key] ? !serverFieldInfo[config.key].isAccessible : false,
                "IsRequired": config.validate ? config.validate.required : false,
                "IsDisabled": config.disabled ? config.disabled : serverFieldInfo[config.key] ? (component.get('v.Data') && component.get('v.Data').Id ? !serverFieldInfo[config.key].isUpdateable : !serverFieldInfo[config.key].isCreateable) : false,
                "Value": value,
                "Data": component.getReference('v.Data'),
                "Class": config.customClass ? config.customClass : '',
                "MaxLength": config.validate ? config.validate.maxLength : undefined,
                "DefaultValue": self.getUrlParam(config.key) ? self.getUrlParam(config.key) : config.defaultValue,
                "JsonLogic": config.validate ? config.validate.json : '',
                "FailureValidationMessage": config.validate ? config.validate.failureValidationMessage : '',
            },
            function(newComponent, status, errorMessage){
                self.callbackHandler(config, component, newComponent, status, errorMessage);
            });
    },


    /*
     * Function : display input email
     *
     *
     */
    generateInputEmail : function(component, config){
        var serverFieldInfo = component.get('v.FieldInfo');
        var self = this;

        // set value and get it reference
        component.set('v.Data['+ config.key +']',
                      component.get('v.Data') ? (component.get('v.Data')[config.key] ? component.get('v.Data')[config.key] : undefined) : undefined);
        var value = component.getReference('v.Data['+ config.key +']');

        // add to temporary flow data
        this.add2TmpFlowData(component, config.key, value);

        $A.createComponent(
            'c:S360_Base_InputEmail',
            {
                "aura:id": config.key,
                "CompId": config.key,
                "InputLabel": config.label ? config.label : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].label ? serverFieldInfo[config.key].label : '') : ''),
                "HelpText": config.tooltip ? config.tooltip : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].helpText ? serverFieldInfo[config.key].helpText : '') : ''),
                "PlaceholderText": config.placeholder ? config.placeholder : '',
                "IsHidden": serverFieldInfo[config.key] ? !serverFieldInfo[config.key].isAccessible : false,
                "IsRequired": config.validate ? config.validate.required : false,
                "IsDisabled": config.disabled ? config.disabled : serverFieldInfo[config.key] ? (component.get('v.Data') && component.get('v.Data').Id ? !serverFieldInfo[config.key].isUpdateable : !serverFieldInfo[config.key].isCreateable) : false,
                "Value": value,
                "Class": config.customClass ? config.customClass : ''
            },
            function(newComponent, status, errorMessage){
                self.callbackHandler(config, component, newComponent, status, errorMessage);
            });
    },


    /*
     * Function : display input phone number
     *
     *
     */
    generateInputPhoneNumber : function(component, config){
        var serverFieldInfo = component.get('v.FieldInfo');
        var self = this;

        // set value and get it reference
        component.set('v.Data['+ config.key +']',
                      component.get('v.Data') ? (component.get('v.Data')[config.key] ? component.get('v.Data')[config.key] : undefined) : undefined);
        var value = component.getReference('v.Data['+ config.key +']');

        // add to temporary flow data
        this.add2TmpFlowData(component, config.key, value);

        $A.createComponent(
            'c:S360_Base_InputPhone',
            {
                "aura:id": config.key,
                "CompId": config.key,
                "InputLabel": config.label ? config.label : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].label ? serverFieldInfo[config.key].label : '') : ''),
                "HelpText": config.tooltip ? config.tooltip : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].helpText ? serverFieldInfo[config.key].helpText : '') : ''),
                "PlaceholderText": config.placeholder ? config.placeholder : '',
                "IsHidden": serverFieldInfo[config.key] ? !serverFieldInfo[config.key].isAccessible : false,
                "IsRequired": config.validate ? config.validate.required : false,
                "IsDisabled": config.disabled ? config.disabled : serverFieldInfo[config.key] ? (component.get('v.Data') && component.get('v.Data').Id ? !serverFieldInfo[config.key].isUpdateable : !serverFieldInfo[config.key].isCreateable) : false,
                "Value": value,
                "Class": config.customClass ? config.customClass : ''
            },
            function(newComponent, status, errorMessage){
                self.callbackHandler(config, component, newComponent, status, errorMessage);
            });
    },


    /*
     * Function : display lookup
     *
     *
     */
    generateLookup : function(component, config){
        var serverFieldInfo = component.get('v.FieldInfo');
        var self = this;

        // get it reference
        var field = config.key.substr(0, config.key.lastIndexOf("__c")) + '__r';

        var value1 = component.getReference('v.Data['+ config.key +']');
        var value2 = component.getReference('v.Data['+ field +']');

        //debugger;

        // add to temporary flow data
        this.add2TmpFlowData(component, config.key, value1);
        this.add2TmpFlowData(component, field, value2);

        // build dependent field
        var dependantField = [];
        var dependantFieldType = [];
        var dependantFieldValue = [];

        config.dependents.forEach(function(d){
            dependantField.push(d.field + d.operator);
            dependantFieldType.push(d.type);
            dependantFieldValue.push(d.value);
        });

        $A.createComponent(
            'c:S360_Base_Lookup',
            {
                "aura:id": config.key,
                "CompId": config.key,
                "instanceId" : config.key,
                "label": config.label ? config.label : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].label ? serverFieldInfo[config.key].label : '') : ''),
                "sObjectAPIName" : config.parentObject,
                "searchString" : component.get('v.Data')[field] ? component.get('v.Data')[field].Name : '',
                "dependantField" : dependantField.join(','),
                "dependantFieldType" : dependantFieldType.join(','),
                "dependantFieldValue" : dependantFieldValue.join(',')
            },
            function(newComponent, status, errorMessage){
                if(component.get('v.Data') && component.get('v.Data')[config.key]){
                	newComponent.prepareLookup();
                }

                self.callbackHandler(config, component, newComponent, status, errorMessage);
            });
    },


    /*
     * Function : display captcha
     *
     *
     */
    generateCaptcha : function(component, config){
        var serverFieldInfo = component.get('v.FieldInfo');
        var self = this;

        $A.createComponent(
            'c:S360_B_Base_Captcha',
            {
                "aura:id": config.key,
                "CompId": config.key,
                "SiteKey" : config.siteKey,
                "Lang" : config.language
            },
            function(newComponent, status, errorMessage){
                if(!errorMessage){
                    component.set('v.isCaptchaEnabled', true);
                }
                self.callbackHandler(config, component, newComponent, status, errorMessage);
            });
    },


    /*
     * Function : display print button
     *
     *
     */
    generateButtonPrint : function(component, config){
        var self = this;

        // set value and get it reference
        var value = component.getReference('v.Data');
        var parentId = component.getReference('v.Data.Id');

        $A.createComponent(
            'c:S360_Base_PrintButton',
            {
                "aura:id": config.key,
                "CompId": config.key,
                "ButtonLabel": config.label,
                "Class": config.customClass,
                "IsHidden": config.hidden ? config.hidden : false,
                "IsDisabled": config.disabled ? config.disabled : false,
                "ParentID" : parentId,
                "TemplateID":config.attachmentId,
                "TemplateName" : config.attachmentName,
                "PrintType":config.printType,
                "DataToInject":value,
                "PrintAction":config.printAction,
                "Token":config.token,
                "HerokuLink":config.herokuLink
            },
            function(newComponent, status, errorMessage){
                self.callbackHandler(config, component, newComponent, status, errorMessage);
            });
    },


    /*
     * Function : generate lightning flow
     *
     *
     */
    generateLightningFlow : function(component, config){
        var self = this;

        // set value and get it reference
        var value = component.getReference('v.Data');
        //debugger;

        $A.createComponent(
            'c:S360_Base_LightningFlow',
            {
                "aura:id": config.key,
                "CompId": config.key,
                "FlowName": config.flowName,
                "FlowData": config.flowData,
            },
            function(newComponent, status, errorMessage){
                self.callbackHandler(config, component, newComponent, status, errorMessage);
            });
    },


    /*
     * Function : generate lightning flow
     *
     *
     */
    generateLightningFlowButton : function(component, config){
        var self = this;

        $A.createComponent(
            'c:S360_Base_LightningFlowButton',
            {
                "aura:id": config.key,
                "CompId": config.key,
                "availableFlowAction": component.get('v.availableFlowAction')
            },
            function(newComponent, status, errorMessage){
                self.callbackHandler(config, component, newComponent, status, errorMessage);
                // we don't register this button to actionButton so that it will bubble up to S360_FormBuilderMain

                // check fields that will be output of this flow
                var refOutputFlow = component.get('v.refOutputFlow');
                var flowData = component.get('v.flowData');

                if(!refOutputFlow){
                    refOutputFlow = {};
                }

                if(!flowData){
                    flowData = {};
                }

                config.selectedInputFields.forEach(function(f){
                    if(flowData[f] == undefined){
                        flowData[f] = '';
                    }

                    refOutputFlow[f] = flowData[f];

                    // if it is a lookup
                    if(config.selectedInputFieldDetails[f].type === 'lookup'){
                        if(f.lastIndexOf("__c") == f.length - 3){
                         	f = f.substr(0, f.lastIndexOf("__c")) + '__r';
                            if(flowData[f] == undefined){
                                flowData[f] = '';
                            }

                            refOutputFlow[f] = flowData[f];
                        }
                    }
                });

                component.set('v.refOutputFlow', refOutputFlow);
                component.set('v.flowData', flowData);

                // save what form does in flow
                component.set('v.formFlowAction', config.actionType);
            });
    },



    /*
     * Function : display signature
     *
     */

    generateSignature : function(component, config){
        var serverFieldInfo = component.get('v.FieldInfo');
        var self = this;

        var id = component.getReference('v.Data[Id]');
        var signatureData = component.getReference('v.signatureData');
        var canvas = component.getReference('v.canvas');

        $A.createComponent(
            'c:S360_Signature',
            {
                "aura:id": config.key,
                "recordId": id,
                "signaturePad" : signatureData,
                "canvas" : canvas,
                "showControllButton" : false
            },
            function(newComponent, status, errorMessage){
                component.set('v.isSignatureEnabled', true);
                self.callbackHandler(config, component, newComponent, status, errorMessage);
            });
    },


    /*
     * Function : display Carousel
     *
     *
     */
    generateCarousel : function(component, config){
        var self = this;
        var id = component.getReference('v.Data[Id]');

        // if local definition
        var slidersList = [];
        var captionsList = [];
        if(config.resource === 'localDefinition'){
            if(config.localDefinitions){
                config.localDefinitions.forEach(function(ld){
                    var slide = {};
                    if(ld.type === 'image'){
                        slide.imageURL = ld.imageUrl;
                        slide.isFocused = false;
                        slide.isImage = true;
                        slide.redirectURL = ld.redirectLink;
                    }else{
                        slide.videoType = ld.videoType;
                        slide.videoEmbedId = ld.videoId;
                        slide.isFocused = false;
                        slide.isImage = false;
                    }
                    slidersList.push(slide);
                    if(ld.caption){
                    	captionsList.push(ld.caption);
                    }else{
                        captionsList.push('');
                    }

                });
            }
        }

        $A.createComponent(
            'c:S360_Base_Carousel',
            {
                "aura:id": config.key,
                "parentId": id,
                "slidersList" : slidersList,
                "captionsList" : captionsList,
                "lookupParentField" : config.salesforce.carouselParentField,
                "carouselObject" : config.salesforce.carouselObject,
                "carouselCaptionField" : config.salesforce.carouselCaptionField,
                "carouselTypeField" : config.salesforce.carouselTypeField,
                "carouselVideoTypeField" : config.salesforce.carouselVideoTypeField,
                "carouselVideoIdField" : config.salesforce.carouselVideoIdField,
                "carouselImageRedirectLinkField" : config.salesforce.carouselImageRedirectLinkField,
                "showThumbnails" : config.showThumbnails,
            },
            function(newComponent, status, errorMessage){
                component.set('v.isSignatureEnabled', true);
                self.callbackHandler(config, component, newComponent, status, errorMessage);
            });
    },


    /*
     * Function : display number input
     *
     *
     */
    generateInputNumber : function(component, config){
        var serverFieldInfo = component.get('v.FieldInfo');
        var self = this;

        // set value and get it reference
        component.set('v.Data['+ config.key +']',
                     component.get('v.Data') ? (component.get('v.Data')[config.key] ? component.get('v.Data')[config.key] : undefined) : undefined);
        var value = component.getReference('v.Data['+ config.key +']');

        // add to temporary flow data
        this.add2TmpFlowData(component, config.key, value);

        $A.createComponent(
            'c:S360_Base_InputNumberCmp',
            {
                "aura:id": config.key,
                "CompId": config.key,
                "InputLabel": config.label ? config.label : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].label ? serverFieldInfo[config.key].label : '') : ''),
                "HelpText": config.tooltip ? config.tooltip : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].helpText ? serverFieldInfo[config.key].helpText : '') : ''),
                "PlaceholderText": config.placeholder ? config.placeholder : '',
                "IsHidden": serverFieldInfo[config.key] ? !serverFieldInfo[config.key].isAccessible : false,
                "IsRequired": config.validate.required,
                "IsDisabled": config.disabled ? config.disabled : serverFieldInfo[config.key] ? (component.get('v.Data') && component.get('v.Data').Id ? !serverFieldInfo[config.key].isUpdateable : !serverFieldInfo[config.key].isCreateable) : false,
                "DefaultValue": self.getUrlParam(config.key) ? self.getUrlParam(config.key) : config.defaultValue,
                "Value": value,
                "Class": config.customClass ? config.customClass : '',
                "JsonLogic": config.validate ? config.validate.json : '',
                "FailureValidationMessage": config.validate ? config.validate.failureValidationMessage : '',
                "Data": component.getReference('v.Data')
            },
            function(newComponent, status, errorMessage){
                self.callbackHandler(config, component, newComponent, status, errorMessage);
            }
        );
    },

    /*
     * Function : display input password/secret
     *
     *
     */
    generateInputSecret : function(component, config){
        var serverFieldInfo = component.get('v.FieldInfo');
        var self = this;

        // set value and get it reference
        component.set('v.Data['+ config.key +']',
                      component.get('v.Data') ? (component.get('v.Data')[config.key] ? component.get('v.Data')[config.key] : undefined) : undefined);
        var value = component.getReference('v.Data['+ config.key +']');

        // add to temporary flow data
        this.add2TmpFlowData(component, config.key, value);

        $A.createComponent(
            'c:S360_Base_InputSecret',
            {
                "aura:id": config.key,
                "CompId": config.key,
                "InputLabel": config.label ? config.label : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].label ? serverFieldInfo[config.key].label : '') : ''),
                "HelpText": config.tooltip ? config.tooltip : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].helpText ? serverFieldInfo[config.key].helpText : '') : ''),
                "PlaceholderText": config.placeholder ? config.placeholder : '',
                "IsHidden": serverFieldInfo[config.key] ? !serverFieldInfo[config.key].isAccessible : false,
                "IsRequired": config.validate ? config.validate.required : false,
                "IsDisabled": config.disabled ? config.disabled : serverFieldInfo[config.key] ? (component.get('v.Data') && component.get('v.Data').Id ? !serverFieldInfo[config.key].isUpdateable : !serverFieldInfo[config.key].isCreateable) : false,
                "Value": value,
                "Class": config.customClass ? config.customClass : '',
                "MaxLength": config.validate ? config.validate.maxLength : undefined,
                "Json": config.validate ? config.validate.json : '',
                "Data": component.getReference('v.Data')
            },
            function(newComponent, status, errorMessage){
                self.callbackHandler(config, component, newComponent, status, errorMessage);
            }
        );
    },

    /*
     * Function : display html element
     *
     *
     */
    generateHtmlElement: function(component, config){
        var self = this;
        var attribues = [];
        config.attrs.forEach(function(attr){
            attribues.push([attr.attr, attr.value]);
        });

        $A.createComponent(
            'c:S360_Base_HtmlElement',
            {
                "aura:id": config.key,
                "Tag": config.tag,
                "Class": config.className,
                "Attributes": attribues,
                "Content": config.content
            },
            function(newComponent, status, errorMessage){
                self.callbackHandler(config, component, newComponent, status, errorMessage);
            }
        );
    },

    /*
     * Function : display checkbox
     *
     *
     */
    generateCheckbox : function(component, config){
        var serverFieldInfo = component.get('v.FieldInfo');
        var self = this;

        // set value and get it reference
        component.set('v.Data['+ config.key +']',
                      self.getUrlParam(config.key) != undefined ? self.getUrlParam(config.key) : (component.get('v.Data') ? (component.get('v.Data')[config.key] ? component.get('v.Data')[config.key] : undefined) : undefined));
        var value = component.getReference('v.Data['+ config.key +']');

        // add to temporary flow data
        this.add2TmpFlowData(component, config.key, value);

        $A.createComponent(
            'c:S360_Base_CheckboxCmp',
            {
                "aura:id": config.key,
                "CompId": config.key,
                "InputLabel": config.label ? config.label : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].label ? serverFieldInfo[config.key].label : '') : ''),
                "HelpText": config.tooltip ? config.tooltip : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].helpText ? serverFieldInfo[config.key].helpText : '') : ''),
                "IsHidden": serverFieldInfo[config.key] ? !serverFieldInfo[config.key].isAccessible : false,
                "IsRequired": config.validate ? config.validate.required : false,
                "IsDisabled": config.disabled ? config.disabled : serverFieldInfo[config.key] ? (component.get('v.Data') && component.get('v.Data').Id ? !serverFieldInfo[config.key].isUpdateable : !serverFieldInfo[config.key].isCreateable) : false,
                "IsChecked": value,
                "InputClass": config.customClass ? config.customClass : '',
                "Json": config.validate ? config.validate.json : '',
                "Data": component.getReference('v.Data'),
                "LabelPosition" : config.labelPosition
            },
            function(newComponent, status, errorMessage){
                self.callbackHandler(config, component, newComponent, status, errorMessage);
            }
        );
    },

    /*
     * Function : display input password/secret
     *
     *
     */
    generateInputSelect : function(component, config){
        var arrPicklistKeyVal = [];
        var picklistKeyVal = "";
        // construct defined key value picklist
        config.data.values.forEach(function(item){
            if(item.label != '' && item.value != ''){
             	arrPicklistKeyVal.push(item.label + '|' + item.value);
            }
        });
        picklistKeyVal = arrPicklistKeyVal.join(',');

        // if field api available
        var sobject;
        var recordType;
        var field;
        if(config.data.custom != ''){
            sobject = config.data.custom.split(',')[0];
            recordType = config.data.custom.split(',')[1];
            field = config.data.custom.split(',')[2] ? config.data.custom.split(',')[2] : config.key;
        }else if(picklistKeyVal == '' && config.data.custom == ''){
            sobject = component.get('v.FormConfig').S360_FA__Primary_Object__c ;
            field = config.key;
        }

        // if field is not correct
        // reset sobject to empty so it will not perform server call
        //debugger;
        if(component.get('v.FieldInfo')[field] == undefined){
            sobject = '';
        }
        //debugger;

        var serverFieldInfo = component.get('v.FieldInfo');
        var self = this;

        // set value and get it reference
        component.set('v.Data['+ config.key +']',
                     self.getUrlParam(config.key) ? self.getUrlParam(config.key) : ((component.get('v.Data') && component.get('v.Data')[config.key]) ? component.get('v.Data')[config.key] : config.defaultValue));
        var value = component.getReference('v.Data['+ config.key +']');

        // add to temporary flow data
        this.add2TmpFlowData(component, config.key, value);

        $A.createComponent(
            'c:S360_Base_PicklistCmp',
            {
                "aura:id": config.key,
                "CompId": config.key,
                "InputLabel": config.label ? config.label : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].label ? serverFieldInfo[config.key].label : '') : ''),
                "HelpText": config.tooltip ? config.tooltip : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].helpText ? serverFieldInfo[config.key].helpText : '') : ''),
                "IsHidden": serverFieldInfo[config.key] ? !serverFieldInfo[config.key].isAccessible : false,
                "IsRequired": config.validate ? config.validate.required : false,
                "IsDisabled": config.disabled ? config.disabled : serverFieldInfo[config.key] ? (component.get('v.Data') && component.get('v.Data').Id ? !serverFieldInfo[config.key].isUpdateable : !serverFieldInfo[config.key].isCreateable) : false,
                "PicklistKV": picklistKeyVal,
                "DefaultK": value,
                "SObjectName": sobject,
                "RecordTypeName": recordType,
                "FieldName": field,
                "Class": config.customClass ? config.customClass : '',
                "ShowBlank": true,
                "Multiple" : config.multiple ? true : false
            },
            function(newComponent, status, errorMessage){
                self.callbackHandler(config, component, newComponent, status, errorMessage);
            }
        );
    },

    /*
     * Function : display button
     *
     *
     */
    generateButton : function(component, config){
        var self = this;
        var serverFieldInfo = component.get('v.FieldInfo');

        $A.createComponent(
            'c:S360_Base_ButtonCmp',
            {
                "aura:id": config.key,
                "CompId": config.key,
                "ButtonLabel": config.label,
                "IsHidden": serverFieldInfo[config.key] ? !serverFieldInfo[config.key].isAccessible : false,
                "IsDisabled": config.disabled ? config.disabled : serverFieldInfo[config.key] ? (component.get('v.Data') && component.get('v.Data').Id ? !serverFieldInfo[config.key].isUpdateable : !serverFieldInfo[config.key].isCreateable) : false,
                "Class": config.customClass ? config.customClass : ''
            },
            function(newComponent, status, errorMessage){

                /**
                 * if action type of this button is submit, put this button to submittedButton,
                 * so it will be able to upsert record from this main form builder
                 *
                 */
                if(config.action == 'standard' && config.event == 'submit'){
                    var successCallback;
                    var failedCallback;
                    var redirect;
                    var target;

                    if(config.submitSuccess || config.submitFailed){
                    	successCallback = config.submitSuccessCallback;
                    	failedCallback = config.submitFailedCallback;
                    }

                    if(config.submitRedirect){
                    	redirect=config.redirectUri;
                    	target=config.redirectTarget;
                    }

                    if(target != undefined && redirect == undefined){
                        console.log('redirect link is mandatory when target setted');
                        return;
                    }

                    if((successCallback != undefined || failedCallback != undefined) && redirect != undefined){
                        console.log('you only allowed to use [success/failed] callback or redirect');
                        return;
                    }

                    var buildCustomSubmitAction = '';
                    if(successCallback != undefined || failedCallback != undefined){
                        buildCustomSubmitAction = 'submit('
                        + (successCallback != undefined ? successCallback : 'null') + ','
                        + (failedCallback != undefined ? failedCallback : 'null')
                        + ')';
                    }else if(redirect != undefined){
                        var buildRedirect = 'redirect(' + redirect + (target ? ',' + target : '') + ')';
                        buildCustomSubmitAction = 'submit('+ buildRedirect +')';
                    }else{
                        buildCustomSubmitAction = 'submit()';
                    }

                    //put it too custom action button
                    var actionButton = component.get('v.actionButton');
                    if(actionButton == undefined || actionButton == ''){
                        actionButton = {};
                    }

                    actionButton[config.key] = {
                        actionType: 'custom',
                        action: buildCustomSubmitAction
                    }

                    component.set('v.actionButton', actionButton);



                    /**
                     * configure object level security
                     */
                    var objectInfo = component.get('v.ObjectInfo');
                    var recordId = component.get('v.Data').Id;
                    //debugger;
                    if(recordId){
                        // check for updateable permission
                        if(!objectInfo.isUpdateable){
                            newComponent.set('v.IsDisabled', true);
                        }
                    }else{
                        // check for creatable permission
                        if(!objectInfo.isCreateable){
                            newComponent.set('v.IsDisabled', true);
                        }
                    }
                }else if(config.action == 'standard'){
                    if(config.event != '' && config.event != undefined){
                        var actionType = config.event;
                        var targetApi = config.target ? config.target : undefined;

                        var actionButton = component.get('v.actionButton');
                        if(actionButton == undefined || actionButton == ''){
                            actionButton = {};
                        }

                        if(actionType === 'redirect'){
                            actionButton[config.key] = {
                                actionType: 'event',
                                actionName: actionType,
                                actionUri: config.redirectUri ? config.redirectUri : undefined,
                                actionTarget: config.redirectTarget ? config.redirectTarget : undefined,
                            }
                        }else{
                        	actionButton[config.key] = {
                                actionType: 'event',
                                actionName: actionType,
                                actionTarget: targetApi
                            }
                        }

                        // check is button has next or prev event, if yes put on the slidingPanelButton
                        var slidingPanelButton = component.get('v.slidingPanelButton');

                        if(actionType === 'next'){
                            if(slidingPanelButton[targetApi] == undefined){
                                slidingPanelButton[targetApi] = {};
                            }

                            slidingPanelButton[targetApi].next = config.key;
                            component.set('v.slidingPanelButton', slidingPanelButton);
                        }

                        if(actionType === 'previous'){
                            if(slidingPanelButton[targetApi] == undefined){
                                slidingPanelButton[targetApi] = {};
                            }

                            slidingPanelButton[targetApi].previous = config.key;
                            component.set('v.slidingPanelButton', slidingPanelButton);

                            // disabled previous button
                            newComponent.set('v.IsDisabled', true);
                        }

                        component.set('v.actionButton', actionButton);
                    }
                }else if(config.action == 'custom'){
                    if(config.custom != '' && config.custom != undefined){
                    	var actionButton = component.get('v.actionButton');
                        if(actionButton == undefined || actionButton == ''){
                            actionButton = {};
                        }

                        // check is custom event is next/previous
                        var eventName = config.custom.match(/[\w\s]+(?=\()/);
                        var hasChainEvent = config.custom.match(/,/) == null ? false : true;
                        var targetPanel;
                        if(eventName[0] == 'next' || eventName[0] == 'previous'){
                            if(hasChainEvent){
                                targetPanel = config.custom.match(/[\w\s]+(?=,)/);
                            }else{
                                targetPanel = config.custom.match(/[\w\s]+(?=\))/);
                            }

                            // check is button has next or prev event, if yes put on the slidingPanelButton
                            var slidingPanelButton = component.get('v.slidingPanelButton');

                            if(slidingPanelButton[targetPanel] == undefined){
                                slidingPanelButton[targetPanel] = {};
                            }

                            if(eventName[0] === 'next'){
                                slidingPanelButton[targetPanel].next = config.key;
                                component.set('v.slidingPanelButton', slidingPanelButton);
                            }

                            if(eventName[0] === 'previous'){
                                slidingPanelButton[targetPanel].previous = config.key;
                                component.set('v.slidingPanelButton', slidingPanelButton);

                                // disabled previous button
                                newComponent.set('v.IsDisabled', true);
                            }
                        }else if(eventName[0] == 'submit'){
                            /**
                             * configure object level security
                             */
                            var objectInfo = component.get('v.ObjectInfo');
                            var recordId = component.get('v.Data').Id;
                            //debugger;
                            if(recordId){
                                // check for updateable permission
                                if(!objectInfo.isUpdateable){
                                    newComponent.set('v.IsDisabled', true);
                                }
                            }else{
                                // check for creatable permission
                                if(!objectInfo.isCreateable){
                                    newComponent.set('v.IsDisabled', true);
                                }
                            }
                        }
                        // end check is custom event is next/previous

                        actionButton[config.key] = {
                            actionType: 'custom',
                            action: config.custom
                        }

                        component.set('v.actionButton', actionButton);
                    }
                }

                self.callbackHandler(config, component, newComponent, status, errorMessage);
            }
        );
    },

    /*
     * Function : display column container
     *
     *
     */
    generateColumn : function(component, config){
        var self = this;
        //
        $A.createComponent(
                'c:S360_Base_ColumnCmp',
                {
                    "aura:id": config.key
                },
                function(newComponent, status, errorMessage){
                    self.callbackHandler(config, component, newComponent, status, errorMessage);
                    config.columns.forEach(function(item){
                        self.generatorMapping(component, item);
                    });
                }
            );
    },

    /*
     * Function : display column item
     *
     *
     */
    generateColumnItem : function(component, config){
        var self = this;
        $A.createComponent(
                'c:S360_Base_ColumnItemCmp',
                {
                    "aura:id": config.key,
                    "Class": "slds-size_1-of-1 slds-large-size_"+ config.width +"-of-12"
                },
                function(newComponent, status, errorMessage){
                    self.callbackHandler(config, component, newComponent, status, errorMessage);
                    config.components.forEach(function(item){
                        self.generatorMapping(component, item);
                    });
                }
            );
    },

    /*
     * Function : display div
     *
     *
     */
    generateDiv : function(component, config){
        var self = this;
        $A.createComponent(
                'c:S360_Base_Div',
                {
                    "aura:id": config.key,
                    "Class": config.customClass ? config.customClass : '',
                },
                function(newComponent, status, errorMessage){
                    self.callbackHandler(config, component, newComponent, status, errorMessage);
                    config.components.forEach(function(item){
                        self.generatorMapping(component, item);
                    });
                }
            );
    },

    /*
     * Function : display card
     *
     *
     */
    generateCard : function(component, config){
        var self = this;
        $A.createComponent(
                'c:S360_Base_Card',
                {
                    "aura:id": config.key,
                    "Title": config.legend ? config.legend : '',
                    "Class": config.customClass ? config.customClass : ''
                },
                function(newComponent, status, errorMessage){
                    self.callbackHandler(config, component, newComponent, status, errorMessage);
                    config.components.forEach(function(item){
                        self.generatorMapping(component, item);
                    });
                }
            );
    },

    /*
     * Function : display panel
     *
     *
     */
    generatePanel : function(component, config){
        var self = this;
        $A.createComponent(
                'c:S360_Base_PanelCmp',
                {
                    "aura:id": config.key,
                    "Title": config.title ? config.title : '',
                    "Class": config.customClass ? config.customClass : ''
                },
                function(newComponent, status, errorMessage){
                    self.callbackHandler(config, component, newComponent, status, errorMessage);
                    config.components.forEach(function(item){
                        self.generatorMapping(component, item);
                    });
                }
            );
    },

    /*
     * Function : display panel
     *
     *
     */
    generateRelatedList : function(component, config){
        var formName = config.properties ? config.properties.form ? config.properties.form : '' : '';
        var relatedField = config.properties ? config.properties.relatedField ? config.properties.relatedField : '' : '';

        if(formName == '' || relatedField == ''){
            return;
        }

        /**
         * save related data by formName|relatedField as the key
         */
        if(typeof(component.get('v.RelatedData')) === 'string'){
            component.set('v.RelatedData', {});
        }
        component.set('v.RelatedData['+ formName + '|' + relatedField +']', []);
        var relatedRef = component.getReference('v.RelatedData['+ formName + '|' + relatedField +']');

        //debugger;

        var self = this;
        $A.createComponent(
                'c:S360_Base_RelatedList',
                {
                    "aura:id": config.key,
                    "Title": config.label ? config.label : '',
                    "Class": config.customClass ? config.customClass : '',
                    "FormName": formName,
                    "Data": relatedRef,
                    "ParentId": component.get('v.Data')['Id'] ? component.get('v.Data')['Id'] : '',
                    "RelatedField": relatedField
                },
                function(newComponent, status, errorMessage){
                    self.callbackHandler(config, component, newComponent, status, errorMessage);
                }
            );
    },


    /*
     * Function : display hidden field
     *
     *
     */
    generateHidden : function(component, config){
        var self = this;

        // set value and get it reference
        component.set('v.Data['+ config.key +']',
                      component.get('v.Data') ? (component.get('v.Data')[config.key] ? component.get('v.Data')[config.key] : undefined) : undefined);
        var value = component.getReference('v.Data['+ config.key +']');

        $A.createComponent(
                'c:S360_Base_HiddenCmp',
                {
                    "aura:id": config.key,
                    "Value": value,
                    "DefaultValue": self.getUrlParam(config.key) ? self.getUrlParam(config.key) : config.defaultValue
                },
                function(newComponent, status, errorMessage){
                    self.callbackHandler(config, component, newComponent, status, errorMessage);
                }
            );
    },


    /*
     * Function : display date or date/time
     *
     *
     */
    generateDateTime : function(component, config){
        var serverFieldInfo = component.get('v.FieldInfo');
        var self = this;

        // set value and get it reference
        component.set('v.Data['+ config.key +']',
                      component.get('v.Data') ? (component.get('v.Data')[config.key] ? component.get('v.Data')[config.key] : undefined) : undefined);
        // clear datetime
        var whichComponent = 'c:S360_Base_DateCmp';
        if(config.enableTime){
            whichComponent = 'c:S360_Base_DateTimeCmp';
        }

        var value = component.getReference('v.Data['+ config.key +']');

        $A.createComponent(
            whichComponent,
            {
                "aura:id": config.key,
                "CompId": config.key,
                "InputLabel": config.label ? config.label : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].label ? serverFieldInfo[config.key].label : '') : ''),
                "HelpText": config.tooltip ? config.tooltip : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].helpText ? serverFieldInfo[config.key].helpText : '') : ''),
                "IsHidden": serverFieldInfo[config.key] ? !serverFieldInfo[config.key].isAccessible : false,
                "IsRequired": config.validate.required,
                "IsDisabled": config.disabled ? config.disabled : serverFieldInfo[config.key] ? (component.get('v.Data') && component.get('v.Data').Id ? !serverFieldInfo[config.key].isUpdateable : !serverFieldInfo[config.key].isCreateable) : false,
                "Date": value,
                "Class": config.customClass ? config.customClass : '',
                "DefaultDate": self.getUrlParam(config.key) ? self.getUrlParam(config.key) : config.defaultValue
            },
            function(newComponent, status, errorMessage){
                self.callbackHandler(config, component, newComponent, status, errorMessage);
            });
    },


    /*
     * Function : display input file
     *
     *
     */
    generateInputFile : function(component, config){
        //debugger;
        var self = this;
        if(component.get('v.Data')['Id'] == undefined){
            return;
        }
        var deletem =  component.get('v.FormConfig');
        $A.createComponent(
                'c:S360_Base_FileUploadTableContainer',
                {
                    "aura:id": config.key,
                    "CompId": config.key,
                    "ReportId": component.get('v.Data')['Id'] ? component.get('v.Data')['Id'] : '',
                    "FormId": component.get('v.FormConfig')['Id']
                    //"FileLabel": config.label,
                    //"Class": config.customClass ? config.customClass : '',
                },
                function(newComponent, status, errorMessage){
                    self.callbackHandler(config, component, newComponent, status, errorMessage);
                }
            );
    },

    generateLightningEmbedded : function(component, config){
        var dependents = config.dependents;
        var dependentsFormatted = {};
        for (var i = 0; i<dependents.length; i++){
           	dependentsFormatted[dependents[i].field]=dependents[i].value;
        }
        var self = this;

        // add to temporary flow data
        $A.createComponent(
            'c:S360_Base_LightningEmbedded',
            {
                "aura:id": config.key,
                "CompId": config.key,
                "label":config.label,
                "Attributes": dependentsFormatted,
                "data": component.getReference('v.Data')

            },
            function(newComponent, status, errorMessage){
                self.callbackHandler(config, component, newComponent, status, errorMessage);
            });
    },

    generateAttachment: function(component, config){

        var self = this;
        var parentId = component.getReference('v.Data.Id');

        // add to temporary flow data
        $A.createComponent(
            'c:S360_Base_Attachment',
            {
                "aura:id": config.key,
                "CompId": config.key,
                "fieldName": config.label,
                "message": config.message,
                "master": config.master,
                "parentId": parentId

            },
            function(newComponent, status, errorMessage){
                self.callbackHandler(config, component, newComponent, status, errorMessage);
            });
    },


	/**
	* this function map the component structre
	*/
    mappingThePattern: function(component, itemConfig){
        var childObj = function(){
            this.key;
            this.parent;
            this.child;
            this.body;
            this.indexInParent;
            this.type; // will be general or column_item, this happens because column config doesn't has a type
        }

        let collections = {};
        let configMapping = {};

        function generatePattern(parent, compParent){
            var patterns = {};
            compParent.forEach(function(compItem, indexA){
                if(compItem.type == 'columns'){
                    var columnObj = new childObj();
                    columnObj.key = compItem['$$hashKey']+''+compItem['key'];

                    if(parent != undefined){
                        columnObj.parent = parent;
                    }
                    columnObj.indexInParent = indexA;
                    columnObj.child = [];

                    // iterate over column items
                    compItem.columns.forEach(function(colItem, indexB){
                        var colChild = new childObj();
                        colChild.key = colItem['$$hashKey']+''+colItem['key'];
                        colChild.parent = columnObj.key;
                        colChild.type = 'column_item';
                        colChild.indexInParent = indexB;
                        colChild.child = generatePattern(colChild.key, colItem.components);

                        columnObj.child[colChild.key] = (colChild);
                        patterns[colChild.key] = colChild;
                        collections[colChild.key] = colChild;

                        // put to configMapping
                        configMapping[colItem['key']] = colItem;
                    });

                    patterns[columnObj.key] = columnObj;
                    collections[columnObj.key] = columnObj;

                    // put to configMapping
                    configMapping[compItem['key']] = compItem;
                }else if(compItem.type == 'well' || compItem.type == 'fieldset' || compItem.type == 'panel'){
                    var compObj = new childObj();
                    compObj.key = compItem['$$hashKey']+''+compItem['key'];
                    if(parent != undefined){
                        compObj.parent = parent;
                    }
                    compObj.indexInParent = indexA;

                    compObj.child = generatePattern(compObj.key, compItem.components);
                    patterns[compObj.key] = compObj;
                    collections[compObj.key] = compObj;

                    // put to configMapping
                    configMapping[compItem['key']] = compItem;
                }else{
                    var child = new childObj();
                    child.key = compItem['$$hashKey']+''+compItem['key'];
                    if(parent != undefined){
                        child.parent = parent;
                    }
                    child.indexInParent = indexA;

                    patterns[child.key] = child;
                    collections[child.key] = child;

                    // put to configMapping
                    configMapping[compItem['key']] = compItem;
                }
            });

            return patterns;
        }

        generatePattern(undefined, itemConfig);

        // save config mapping
        component.set('v.configMapping', configMapping);

        return collections;
    },

    getUrlParam: function(sParam){
        var params = decodeURIComponent(window.location.search.substring(1));
        params = params.split('&');
        for(var i = 0; i < params.length; i++){
            var targetParam = params[i].split('=');
            if(targetParam[0] === sParam){
                return targetParam[1];
            }
        }
    },

    customEventHandler: function(component, sender, customEvent, serverResultEvent){

        if(customEvent == undefined || customEvent == ''){
            return;
        }

        // here we process event that fire after server interaction
        if(serverResultEvent != undefined){
            if(serverResultEvent.type == 'submit'){
                customEvent = customEvent.trim();
                // check is we dont care about the server submit result
                // if yes we out

                if((customEvent.match(/submit\s*\(\s*\)/) != null && customEvent.match(/submit\s*\(\s*\)/).length > 0) ||
                   (customEvent.match(/submit\s*\(\s*null\s*\)/) != null && customEvent.match(/submit\s*\(\s*null\s*\)/).length > 0) ||
                   (customEvent.match(/submit\s*\(\s*null\s*,\s*null\s*\)/) != null && customEvent.match(/submit\s*\(\s*null\s*,\s*null\s*\)/).length > 0)){
                    return;
                }

                var isHasSuccessCallback = true;
                var isHasFailedCallback = true;
                var submitCallback = customEvent.match(/submit\s*\((.*?)\)\s*$/);

                // check does it has success callback or not
                if(customEvent.match(/^(\s*submit\s*\(\s*null)/) != null){
                    isHasSuccessCallback = false;
                }

                // check does it has failed callback or not
                if(customEvent.match(/^(\s*submit\s*\(\s*null)/) != null){
                    if(customEvent.match(/^(\s*submit\s*\(\s*null\s*,)/) == null ||
                       customEvent.match(/^(\s*submit\s*\(\s*null\s*,\s*null)/) != null){
                        isHasFailedCallback = false;
                    }
                }else{
                    if(customEvent.match(/\)\s*,/) == null ||
                       customEvent.match(/\)\s*,\s*null/) != null){
                        isHasFailedCallback = false;
                    }
                }


                if(serverResultEvent.status == 'SUCCESS'){
                    // if we don't have success callback to handle this success
                    // response, just return it
                    if(!isHasSuccessCallback){
                        return;
                    }

                    var successCallback;
                    if(isHasFailedCallback == true){
                        successCallback = submitCallback[1].match(/(.*?)\)\s*,/);
                        successCallback = successCallback[0].slice(0, -1);
                    }else{
                        if(customEvent.match(/\)\s*,\s*null/) != null){
                            successCallback = submitCallback[1].match(/(.*?)\)\s*,/);
                            successCallback = successCallback[0].slice(0, -1);
                        }else{
                            successCallback = submitCallback[1];
                        }

                    }

                    // replace customEvent with successCallback, so we process the callback
                    customEvent = successCallback;

                }else{
                    // if we don't have failed callback to handle this failed
                    // response, just return it
                    if(isHasFailedCallback == false){
                        return;
                    }

                    //find the failed callback
                    var regex;
                    var failedCallback;
                    if(!isHasSuccessCallback){
                        regex = new RegExp("(?<=(submit\\s*\\(\\s*null\\s*,))[\\w\\s\\(\\),]+");
                        failedCallback = customEvent.match(regex)[0].slice(0, -1);
                    }else{
                        regex = new RegExp("(?<=(\\)\\s*,))[\\w\\s\\(\\),]+");
                        failedCallback = submitCallback[1].match(regex);
                        failedCallback = failedCallback[0]
                    }

                    // replace customEvent with failedCallback, so we process the callback
                    customEvent = failedCallback;

                }
            }
        }

        // get event name
        var eventName = customEvent.match(/[\w\s]+(?=\()/);
        if(eventName != null){
            eventName = eventName[0].replace(/\s/g, '');
        }else{
            eventName = undefined;
        }

        /**
         * if eventName equals to submit, we skip the rest block of code and go to eventHandler
         * in order to send event to S360_FormBuilderMain to interact with server
         */

        if(eventName == 'submit'){
            this.eventHandler(component, sender, eventName, undefined, undefined);
            return;
        }

        // get target api
        var targetAPI = customEvent.match(/,/);
        if(targetAPI != null){
            if(eventName == 'redirect'){
                var regLink = new RegExp("[\\w\\s'\\\"\\.\\?\\=\\&\\/\\%]+(?=,)");
                var link = customEvent.match(regLink);

                var regTarget = new RegExp("[\\w\\s'\\\"\\.\\?\\=\\&\\/\\%]+(?=\\))");
                var target = customEvent.match(regTarget);

                // return imediatelly
                this.eventHandler(component, sender, eventName, link[0], target[0].replace(/\s/g, ''));
            	return;
            }else{
            	targetAPI = customEvent.match(/[\w\s]+(?=,)/);
            }
        }else{
            if(eventName == 'redirect'){
                var regLink = new RegExp("[\\w\\s'\\\"\\.\\?\\=\\&\\/\\%]+(?=\\))");
                var link = customEvent.match(regLink);

                var target = '_blank';

                // return imediatelly
                this.eventHandler(component, sender, eventName, link[0], target);
            	return;
            }else{
            	targetAPI = customEvent.match(/[\w\s]+(?=\))/);
            }
        }
        if(targetAPI != null){
            targetAPI = targetAPI[0].replace(/\s/g, '');
        }else{
            targetAPI = undefined;
        }

        // get chaining events
        var chainingEvent = customEvent.split(/,/);
        chainingEvent.shift();
        if(chainingEvent.length == 0){
            chainingEvent = undefined;
        }else{
            chainingEvent = chainingEvent.join();
            chainingEvent = chainingEvent.trim().replace(/\)$/, '');
        }

        this.eventHandler(component, sender, eventName, targetAPI, chainingEvent);
    },

    eventHandler: function(component, sender, eventName, target, chainingEvents){
        if(eventName != undefined && eventName != ''){
            if(eventName === 'show' && target != undefined && target != ''){
                this.showEvent(component, sender, target, chainingEvents);
            }else if(eventName === 'hide' && target != undefined && target != ''){
                this.hideEvent(component, sender, target, chainingEvents);
            }else if(eventName === 'toggleShowHide' && target != undefined && target != ''){
                this.toggleShowHideEvent(component, sender, target, chainingEvents);
            }else if(eventName === 'next' && target != undefined && target != ''){
                this.nextEvent(component, sender, target, chainingEvents);
            }else if(eventName === 'previous' && target != undefined && target != ''){
                this.previousEvent(component, sender, target, chainingEvents);
            }else if(eventName === 'redirect' && target != undefined && target != ''){
                // chainingEvents is standard javascript target redirect
                // default is _blank
                this.redirectEvent(component, sender, target, chainingEvents);
            }else if(eventName === 'submit'){
                this.submitEvent(component, sender, target);
            }
        }
    },

    showEvent: function(component, sender, targetAPI, chainingEvents){
        var componentData = component.get('v.componentData');
        var target = componentData[targetAPI];

        $A.util.removeClass(target, "slds-hide");
        $A.util.addClass(target, "slds-show");

        this.customEventHandler(component, sender, chainingEvents);
    },

    hideEvent: function(component, sender, targetAPI, chainingEvents){
        var componentData = component.get('v.componentData');
        var target = componentData[targetAPI];

        $A.util.removeClass(target, "slds-show");
        $A.util.addClass(target, "slds-hide");

        this.customEventHandler(component, sender, chainingEvents);
    },

    toggleShowHideEvent: function(component, sender, targetAPI, chainingEvents){
        var componentData = component.get('v.componentData');
        var target = componentData[targetAPI];

        if($A.util.hasClass(target, "slds-show")){
            $A.util.removeClass(target, "slds-show");
            $A.util.addClass(target, "slds-hide");
        }else if($A.util.hasClass(target, "slds-hide")){
            $A.util.removeClass(target, "slds-hide");
            $A.util.addClass(target, "slds-show");
        }else{
            $A.util.toggleClass(target, "slds-hide");
        }

        //$A.util.toggleClass(target, "slds-hide");

        this.customEventHandler(component, sender, chainingEvents);
    },

    nextEvent: function(component, sender, targetAPI, chainingEvents){
        var componentData = component.get('v.componentData');
        var target = componentData[targetAPI];

        target.next();

        // undisable previous button sender

        var prevButtonSender = component.get('v.slidingPanelButton')[targetAPI].previous;
        componentData[prevButtonSender].getElement().disabled  = false;

        // disable button sender
        console.log(target.get('v.displayPosition'));
        if(target.get('v.displayPosition') == target.get('v.body').length - 1){
            componentData[sender].getElement().disabled  = true;
        }

        this.customEventHandler(component, sender, chainingEvents);
    },

    previousEvent: function(component, sender, targetAPI, chainingEvents){
        var componentData = component.get('v.componentData');
        var target = componentData[targetAPI];

        target.previous();
        // undisable next button sender

        var nextButtonSender = component.get('v.slidingPanelButton')[targetAPI].next;
        componentData[nextButtonSender].getElement().disabled  = false;

        // disable button sender
        if(target.get('v.displayPosition') == 0){
            componentData[sender].getElement().disabled  = true;
        }

        this.customEventHandler(component, sender, chainingEvents);
    },

    redirectEvent: function(component, sender, uri, target){

        window.open(uri, target);
        //window.location.href = uri;
    },

    submitEvent: function(component, sender){
        debugger;
        var isAllValid = true;
        // validate fields before submit
        if(jsonLogic != undefined && jsonLogic != ''){
            var componentData = component.get('v.componentData');
            for(var key in componentData){
                if(componentData.hasOwnProperty(key)){

                    if(componentData[key].get('v.input') === true){
                        // check is required
                        if(componentData[key].get('v.IsRequired') == true && !componentData[key].get('v.Value')){
                            componentData[key].validationFail($A.get("$Label.c.S360_Field_Required"));
                            isAllValid = false;
                            continue;
                        }

                        // check validation
                        if(componentData[key].get('v.JsonLogic')){
                            var jsonLogicData = {
                                "value": componentData[key].get('v.Value'),
                                "name": key
                            }

                            //JSLogic Validation
                            var validateJson = componentData[key].get('v.JsonLogic');
                            var isValid = jsonLogic.apply(validateJson, jsonLogicData);

                            if(!isValid){
                                isAllValid = false;
                                componentData[key].validationFail();
                            }
                        }
                    }
                }
            }
        }

        if(!isAllValid){
            return;
        }

        if(component.get('v.isCaptchaEnabled') && !component.get('v.isCaptchaSuccess')){
            this.showToast(component, 'warning', $A.get("$Label.c.S360_base_captcha_message"));
            return;
        }

        var evt = component.getEvent('S360_FormBuilderEvt');
        evt.setParams({
            "sender": sender,
            "action": "submit"
        });
        evt.fire();
    },

    showToast: function(comp, type, message){
        comp.set('v.TextMessage', message);
        comp.set('v.ToastType', type);
        var toastValue = comp.get('v.showToast');
        if(toastValue)
        {
            comp.set('v.showToast',false);
        }else
        {
            comp.set('v.showToast',true);
        }

    },

    pushAndSortMappingConfig: function(data, source){
        var tmp = source;

        if(tmp.length == 0){
            tmp.push(data)
        }else{
            for(var i = 0; i < source.length; i++){
                if(source[i].indexInParent < data.indexInParent){
                    if(source[i+1] == undefined){
                        tmp.splice(i+1, 0, data);
                        break;
                    }else if(source[i+1] != undefined && source[i+1].indexInParent > data.indexInParent){
                        tmp.splice(i+1, 0, data);
                        break;
                    }
                }else if(source[i].indexInParent > data.indexInParent){
                    if(i == 0){
                        tmp.splice(0, 0, data);
                        break;
                    }else if(source[i-1] != undefined && source[i-1].indexInParent < data.indexInParent){
                        tmp.splice(i-1, 0, data);
                        break;
                    }
                }
            }
        }

        return tmp;
    },

    add2TmpFlowData: function(component, key, value){
        var flowData = component.get('v.flowData');

        console.log('add2TmpFlowData');
        console.log(key);

        if(!flowData){
            flowData = {};
        }

        flowData[key] = value;
        component.set('v.flowData', flowData);
    },

    getRefVal: function(component, data){
        if(data != null && data != undefined){
        	if(typeof data === 'object' && typeof data.toString === 'function'){
                var key = data.toString().split(' ')[1].replace("{!", "").replace("}", "");
                return component.get(key);
            }
        }

        return undefined;
    },

    refreshRealOutputFlowVal: function(component){
        var refOutputFlow = component.get('v.refOutputFlow');
        var outputFlow = {};
        for(var i in refOutputFlow){
            if(refOutputFlow.hasOwnProperty(i)){
                outputFlow[i] = this.getRefVal(component, refOutputFlow[i]);
            }
        }

        component.set('v.outputFlow', JSON.stringify(outputFlow));
    }
})