({
    FORM_PATTERN: [],
	generateForm : function(component, event, config) {
        this.FORM_PATTERN = this.mappingThePattern(config);
        var self = this;
        config.forEach(function(item){
            self.generatorMapping(component, item);
        });
	},
    
    /**
	 * this function map the component structre
	 */    
    mappingThePattern: function(itemConfig){
        var childObj = function(){
            this.key;
            this.parent;
            this.child;
            this.body;
            this.type; // will be general or column_item, this happens because column config doesn't has a type
        }
        
        let collections = [];
        function generatePattern(parent, compParent){
            var patterns = [];
            compParent.forEach(function(compItem){
                if(compItem.type == 'columns'){
                    var columnObj = new childObj();
                    columnObj.key = compItem['$$hashKey'];
                    if(parent != undefined){
                        columnObj.parent = parent;
                    }
                    columnObj.child = [];
                    
                    // iterate over column items
                    compItem.columns.forEach(function(colItem){
                        var colChild = new childObj(); 
                        colChild.key = colItem['$$hashKey'];
                        colChild.parent = columnObj.key;
                        colChild.type = 'column_item';
                        colChild.child = generatePattern(colChild.key, colItem.components);
                        
                        columnObj.child[colChild.key] = (colChild);    
                        patterns[colChild.key] = colChild;
                        collections[colChild.key] = colChild;
                    });
                    
                    patterns[columnObj.key] = columnObj;
                    collections[columnObj.key] = columnObj;
                }else if(compItem.type == 'well' || compItem.type == 'fieldset' || compItem.type == 'panel'){
                    var compObj = new childObj();
                    compObj.key = compItem['$$hashKey'];
                    if(parent != undefined){
                        compObj.parent = parent;
                    }
                    
                    compObj.child = generatePattern(compObj.key, compItem.components);
                    patterns[compObj.key] = compObj;
                    collections[compObj.key] = compObj;
                }else{
                    var child = new childObj();
                    child.key = compItem['$$hashKey'];
                    if(parent != undefined){
                        child.parent = parent;
                    }
                    patterns[child.key] = child;
                    collections[child.key] = child;
                }
            });
            
            return patterns;
        }
        
        generatePattern(undefined, itemConfig);
        return collections;
    },
    
    callbackHandler: function(config, component, newComponent, status, errorMessage){
        var configKey = config['$$hashKey'];
        var patternObj = this.FORM_PATTERN[configKey];
        var self = this;
        
        // check do this object has a parent, if doesn't put this object to the outmost component
        // else check is this object's parent has been created, if yes, put this object to its parent
        if(patternObj.parent == undefined){
            var body = component.get("v.body");
            body.push(newComponent);
            component.set("v.body", body);
        }else if(this.FORM_PATTERN[patternObj.parent].body != undefined){
            var parentComp = this.FORM_PATTERN[patternObj.parent].body;
            var body = parentComp.get("v.body");
            body.push(newComponent);
            parentComp.set("v.body", body);
        }
        
        // check do this object has childs, if do. put all childs to it
        if(patternObj.child != undefined){
            var childBodies = [];
            patternObj.child.forEach(function(c){
                var child = self.FORM_PATTERN[c.key];
                // if the child has been created, push it to parent
                if(child.body != undefined){
                    childBodies.push(child.body);
                }
            });
            
            var body = newComponent.get('v.body');
            body = body.concat(childBodies);
            newComponent.set('v.body', body);
        }
        
        //update pattern object
        patternObj.body = newComponent;
        this.FORM_PATTERN[configKey] = patternObj;
        
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
        if(item.type === 'textfield'){
            this.generateTextField(component, item);
        }else if(item.type === 'radio'){
            this.generateRadio(component, item);
        }else if(item.type === 'htmlelement'){
            this.generateHtmlElement(component, item);
        }else if(item.type === 'button'){
            this.generateButton(component, item);
        }else if(item.type === 'well'){
            this.generateDiv(component, item);
        }else if(item.type === 'fieldset'){
            this.generateCard(component, item);
        }else if(item.type === 'panel'){
            this.generatePanel(component, item);
        }else{
            callback(undefined);
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
        
        $A.createComponent(
            'c:S360_B_Base_InputText',
            {
                "CompId": config.key,
                "aura:id": config.key,
                "InputLabel": config.label ? config.label : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].label ? serverFieldInfo[config.key].label : '') : ''),
                "PlaceholderText": config.placeholder ? config.placeholder : '',
                "IsHidden": serverFieldInfo[config.key] ? !serverFieldInfo[config.key].isAccessible : false,
                "IsRequired": config.validate.required,
                "IsReadOnly": serverFieldInfo[config.key] ? (component.get('v.Data') && component.get('v.Data').Id ? !serverFieldInfo[config.key].isUpdateable : !serverFieldInfo[config.key].isCreateable) : false,
                "Value": value,
                "Class": config.customClass ? config.customClass : '',
                "DefaultValue": self.getUrlParam(config.key) ? self.getUrlParam(config.key) : config.defaultValue
                
            },
            function(newComponent, status, errorMessage){
                self.callbackHandler(config, component, newComponent, status, errorMessage);
            }
        );
    },
    
    /*
     * Function : display html elements
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
     * Function : display button
     * 
     * 
     */
    generateButton : function(component, config){
        var self = this;
        var serverFieldInfo = component.get('v.FieldInfo');
        
        $A.createComponent(
            'c:S360_B_Base_Button',
            {
                "aura:id": config.key,
                "CompId": config.key,
                "ButtonLabel": config.label,
                "IsHidden": serverFieldInfo[config.key] ? !serverFieldInfo[config.key].isAccessible : false,
                "IsDisabled": serverFieldInfo[config.key] ? ( component.get('v.dataId') ? !serverFieldInfo[config.key].isCreateable : !serverFieldInfo[config.key].isUpdateable) : false,
                "faClass": config.customClass ? config.customClass : ''
            },
            function(newComponent, status, errorMessage){
                /**
                 * if action type of this button is submit, put this button to submittedButton, 
                 * so it will be able to upsert record from this main form builder
                 * 
                 */
                if(config.action == 'submit'){
                    var submittedButton = component.get('v.submittedButton');
                    submittedButton.push(config.key);
                    component.set('v.submittedButton', submittedButton);
                }else if(config.action == 'event'){
                    var actionType = config.event;
                    var targetApi = config.properties ? config.properties.target : undefined;
                    
                    var actionButton = component.get('v.actionButton');
                    if(actionButton == undefined || actionButton == ''){
                        actionButton = {};
                    }
                    
                    actionButton[config.key] = {
                        actionType: 'event',
                        actionName: actionType,
                        actionTarget: targetApi
                    }
                    
                    component.set('v.actionButton', actionButton); 
                }else if(config.action == 'custom'){
                    if(config.custom == '' || config.custom == undefined){
                    	return;    
                    }
                    
                    var actionButton = component.get('v.actionButton');
                    if(actionButton == undefined || actionButton == ''){
                        actionButton = {};
                    }
                    
                    actionButton[config.key] = {
                        actionType: 'custom',
                        action: config.custom
                    }
                    
                    component.set('v.actionButton', actionButton); 
                }
                self.callbackHandler(config, component, newComponent, status, errorMessage);
            }
        );
    },
    
    /*
     * Function : display radio
     * 
     * 
     */
    generateRadio : function(component, config){
        var self = this;
        var serverFieldInfo = component.get('v.FieldInfo');
        var stages = [];
        config.values.forEach(function(item){
            stages.push(item.value);
        });
        
        // set value and get it reference
        component.set('v.Data['+ config.key +']', 
                     self.getUrlParam(config.key) ? self.getUrlParam(config.key) : (config.defaultValue ? config.defaultValue : (component.get('v.Data') ? (component.get('v.Data')[config.key] ? component.get('v.Data')[config.key] : undefined) : undefined)));
        var value = component.getReference('v.Data['+ config.key +']');
        
        $A.createComponent(
            'c:S360_B_Base_RadioGroup',
            {
                "aura:id": config.key,
                "CompId": config.key,
                "InputLabel": config.label,
                "IsHidden": serverFieldInfo[config.key] ? !serverFieldInfo[config.key].isAccessible : false,
                "IsRequired": config.validate.required,
                "IsDisabled": serverFieldInfo[config.key] ? ( component.get('v.dataId') ? !serverFieldInfo[config.key].isCreateable : !serverFieldInfo[config.key].isUpdateable) : false,
                "Class": config.customClass,
                "Stages": stages,
                "Value": value
            },
            function(newComponent, status, errorMessage){
                self.callbackHandler(config, component, newComponent, status, errorMessage);
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
                'c:S360_B_Base_Card',
                {
                    "aura:id": config.key,
                    "Title": config.legend ? config.legend : (component.get('v.Data') && component.get('v.Data').Id ? 'Update ' + component.get('v.Data').Name : 'Create new ' + component.get('v.FormConfig').Primary_Object__c),
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
                'c:S360_B_Base_PanelCmp',
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
                
                
                if(serverResultEvent.status == true){
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
                var reg = new RegExp("[\\w\\s'\\\"\\.\\?\\=\\&\\/\\%]+(?=,)");
                targetAPI = customEvent.match(reg);
            }else{
            	targetAPI = customEvent.match(/[\w\s]+(?=,)/);
            }
        }else{
            if(eventName == 'redirect'){
                var reg = new RegExp("[\\w\\s'\\\"\\.\\?\\=\\&\\/\\%]+(?=\\))");
                targetAPI = customEvent.match(reg);
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
                this.redirectEvent(component, sender, target);
            }else if(eventName === 'submit'){
                this.submitEvent(component, sender, target);
            }
        }
    },
    
    showEvent: function(component, sender, targetAPI, chainingEvents){
        var componentData = component.get('v.componentData');
        var target = componentData[targetAPI];
        
        target.getElement().style.display = 'block';
        
        this.customEventHandler(component, sender, chainingEvents);
    },
    
    hideEvent: function(component, sender, targetAPI, chainingEvents){
        var componentData = component.get('v.componentData');
        var target = componentData[targetAPI];
        
        target.getElement().style.display = 'none';
        
        this.customEventHandler(component, sender, chainingEvents);
    },
    
    toggleShowHideEvent: function(component, sender, targetAPI, chainingEvents){
        var componentData = component.get('v.componentData');
        var target = componentData[targetAPI];
        
        var currDisplay = target.getElement().style.display;
        
        if(currDisplay === 'none'){
            target.getElement().style.display = 'block';
        }else{
            target.getElement().style.display = 'none';
        }
        
        //$A.util.toggleClass(target, "slds-hide");
        
        this.customEventHandler(component, sender, chainingEvents);
    },
    
    nextEvent: function(component, sender, targetAPI, chainingEvents){
        var componentData = component.get('v.componentData');
        var target = componentData[targetAPI];
        
        target.next();
        
        this.customEventHandler(component, sender, chainingEvents);
    },
    
    previousEvent: function(component, sender, targetAPI, chainingEvents){
        var componentData = component.get('v.componentData');
        var target = componentData[targetAPI];
        
        target.previous();
        
        this.customEventHandler(component, sender, chainingEvents);
    },
    
    redirectEvent: function(component, sender, uri){
        //window.open(uri,'_blank');
        window.location.href = uri;
    },
    
    submitEvent: function(component, sender){
        var evt = component.getEvent('S360_FormBuilderEvt');
        evt.setParams({
            "sender": sender,
            "action": "submit"
        });
        evt.fire();
    },
})