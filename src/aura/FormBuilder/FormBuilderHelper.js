({
	generateForm : function(component, event, pos, config) {
        var self = this;
        
        self.generatorMapping(component, config[pos], function(createdCmp){
            pos++;
            if(pos != config.length){
                self.generateForm(component, event, pos, config);
            }
        });
	},
    
    generateTextField : function(globalComponent, config, callback){
        $A.createComponent(
            'c:S360_Base_InputTextCmp',
            {
                "aura:id": config.key,
                "CompId": config.key,
                "InputLabel": config.label ? config.label : '',
                "PlaceholderText": config.placeholder ? config.placeholder : '',
                "IsHidden": config.hidden,
                "IsRequired": config.validate.required,
                "IsDisabled": config.disabled,
                "Value": globalComponent ? globalComponent.get('v.Value')[config.key] ? globalComponent.get('v.Value')[config.key] : '' : undefined,
                "Class": config.customClass ? config.customClass : '',
                "MaxLength": config.validate.maxLength
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
    
    generateColumn : function(globalComponent, config, callback){
        var tmpChilds = [];
        var self = this;
        
        var looper = function(source, destination, pos, callback){
            var item = source[pos];
            var childs = [];
            
            console.log(item.width);
            
            var createChild = function(source2, destination2, pos2, callback2){
                self.generatorMapping(undefined, source2[pos2], function(createdCmp){
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
                        if(globalComponent != null){
                            var body = globalComponent.get("v.body");
                            body.push(createdCmp);
                            globalComponent.set("v.body", body);    
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
    
    generatorMapping: function(component, item, callback){
        if(item.type === 'textfield'){
            this.generateTextField(component, item, callback);
        }else if(item.type === 'columns'){
            this.generateColumn(component, item, callback);
        }
    }
                       
})