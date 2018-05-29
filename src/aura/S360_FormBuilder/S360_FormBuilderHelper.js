({
	generateForm : function(component, event, pos, config) {
        var self = this;
        
        self.generatorMapping(component, component, config[pos], function(createdCmp){
            pos++;
            if(pos != config.length){
                self.generateForm(component, event, pos, config);
            }
        });
	},
    
    /*
     * function : router function to determmine what type of component will
     * 				displayed or created
     * 
     */
    generatorMapping: function(globaComponent, parentComponent, item, callback){
        if(item.type === 'textfield'){
            this.generateTextField(globaComponent, parentComponent, item, callback);
        }else if(item.type === 'columns'){
            this.generateColumn(globaComponent, parentComponent, item, callback);
        }else if(item.type === 'htmlelement'){
            this.generateHtmlElement(globaComponent, parentComponent, item, callback);
        }else if(item.type === 'button'){
            this.generateButton(globaComponent, parentComponent, item, callback);
        }
    },
    
    /*
     * Function : display text input
     * 
     * 
     */
    generateTextField : function(globalComponent, parentComponent, config, callback){
        var serverFieldInfo = globalComponent.get('v.FieldInfo');
        console.log(config.validate.maxLength);
        $A.createComponent(
            'c:S360_Base_InputTextCmp',
            {
                "aura:id": config.key,
                "id": config.key,
                "CompId": config.key,
                "InputLabel": config.label ? config.label : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].label ? serverFieldInfo[config.key].label : '') : ''),
                "HelpText": config.tooltip ? config.tooltip : (serverFieldInfo[config.key] ? (serverFieldInfo[config.key].helpText ? serverFieldInfo[config.key].helpText : '') : ''),
                "PlaceholderText": config.placeholder ? config.placeholder : '',
                "IsHidden": serverFieldInfo[config.key] ? !serverFieldInfo[config.key].isAccessible : false,
                "IsRequired": config.validate.required,
                "IsDisabled": serverFieldInfo[config.key] ? ( globalComponent.get('v.dataId') ? !serverFieldInfo[config.key].isCreateable : !serverFieldInfo[config.key].isUpdateable) : false,
                "Value": globalComponent.get('v.Data') ? (globalComponent.get('v.Data')[config.key] ? globalComponent.get('v.Data')[config.key] : undefined) : undefined,
                "Class": config.customClass ? config.customClass : '',
                "MaxLength": config.validate.maxLength
            },
            function(inputText, status, errorMessage){
                if(status === "SUCCESS") {
                    if(parentComponent != null){
                        var body = parentComponent.get("v.body");
                    	body.push(inputText);
                    	parentComponent.set("v.body", body);    
                    }
                    
                    if(callback != undefined){
                        callback(inputText);
                    }
                    
                    var componentData = globalComponent.get('v.componentData');
                    if(componentData == undefined || componentData == null || componentData == ''){
                        componentData = {};
                    }
                    
                    componentData[inputText.getLocalId()] = inputText;
                    globalComponent.set('v.componentData', componentData);
                    
                }else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.")
                }else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            }
        );
    },
    
    generateBTextField : function(globalComponent, config, callback){
        $A.createComponent(
            'S360_FA:S360_Base_B_Base_InputText',
            {
                "CompId": config.key,
                "InputLabel": config.label ? config.label : '',
                "PlaceholderText": config.placeholder ? config.placeholder : '',
                "IsHidden": config.hidden,
                "IsRequired": config.validate.required,
                "IsDisabled": config.disabled,
                "Value": globalComponent ? globalComponent.get('v.Value')[config.key] ? globalComponent.get('v.Value')[config.key] : '' : undefined,
                "Class": config.customClass ? config.customClass : ''
                
            },
            function(inputText, status, errorMessage){
                if(status === "SUCCESS") {
                    if(globalComponent != null){
                        var body = globalComponent.get("v.body");
                    	body.push(inputText);
                    	globalComponent.set("v.body", body);    
                    }
                    
                    if(callback != undefined){
                        callback(inputText);
                    }
                }else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.")
                }else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            }
        );
    },
    
    generateColumn : function(globalComponent, parentComponent, config, callback){
        var tmpChilds = [];
        var self = this;
        
        var looper = function(source, destination, pos, callback){
            var item = source[pos];
            var childs = [];
            
            var createChild = function(source2, destination2, pos2, callback2){
                self.generatorMapping(globalComponent, undefined, source2[pos2], function(createdCmp){
                    destination2.push(createdCmp);
                    
                    pos2++;
                    if(pos2 != source2.length){
                        createChild(source2, destination2, pos2, callback2);
                    }else{
                     	callback2(destination2);   
                    }
                });
            }
            
            createChild(item.components, [], 0, function(result){
                destination.push({
                    "width": item.width,
                    "childs": result
                });
                
                pos++;
                if(pos != source.length){
                    looper(source, destination, pos, callback);
                }else{
                    callback(destination);
                }
            });
        }
        
        looper(config.columns, [], 0, function(result){
            $A.createComponent(
                'c:S360_Base_ColumnCmp',
                {
                    "aura:id": config.key,
                    "CompId": config.key,
                    "Config": result
                },
                function(createdCmp, status, errorMessage){
                    if(status === "SUCCESS") {
                        if(parentComponent != null){
                            var body = parentComponent.get("v.body");
                            body.push(createdCmp);
                            parentComponent.set("v.body", body);
                            
                        }
                        
                        if(callback != undefined){
                            callback(createdCmp);
                        }
                    }else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.")
                    }else if (status === "ERROR") {
                        console.log("Error: " + errorMessage);
                    }
                }
            );
        });
    },
    
    generateHtmlElement: function(globalComponent, parentComponent, config, callback){
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
            function(inputText, status, errorMessage){
                if(status === "SUCCESS") {
                    if(parentComponent != null){
                        var body = parentComponent.get("v.body");
                    	body.push(inputText);
                    	parentComponent.set("v.body", body);    
                    }
                    
                    if(callback != undefined){
                        callback(inputText);
                    }
                }else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.")
                }else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            }
        );
    },
    
    generateButton : function(globalComponent, parentComponent, config, callback){
        var serverFieldInfo = globalComponent.get('v.FieldInfo');
        
        $A.createComponent(
            'c:S360_Base_ButtonCmp',
            {
                "aura:id": config.key,
                "id": config.key,
                "CompId": config.key,
                "ButtonLabel": config.label,
                "IsHidden": serverFieldInfo[config.key] ? !serverFieldInfo[config.key].isAccessible : false,
                "IsDisabled": serverFieldInfo[config.key] ? ( globalComponent.get('v.dataId') ? !serverFieldInfo[config.key].isCreateable : !serverFieldInfo[config.key].isUpdateable) : false,
                "ButtonClass": config.customClass ? config.customClass : ''
            },
            function(butonComp, status, errorMessage){
                if(status === "SUCCESS") {
                    if(parentComponent != null){
                        var body = parentComponent.get("v.body");
                    	body.push(butonComp);
                    	parentComponent.set("v.body", body);    
                    }
                    
                    if(callback != undefined){
                        callback(butonComp);
                    }
                    
                    var componentData = globalComponent.get('v.componentData');
                    if(componentData == undefined || componentData == null || componentData == ''){
                        componentData = {};
                    }
                    
                    componentData[butonComp.getLocalId()] = butonComp;
                    globalComponent.set('v.componentData', componentData);
                    
                }else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.")
                }else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            }
        );
    },
                       
})