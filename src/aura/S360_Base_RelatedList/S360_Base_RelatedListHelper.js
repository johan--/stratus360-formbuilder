({
	crateListItem : function(component, event, helper){
        var body = component.get('v.body');
        // copy data template and push to data collection and get that refference for our new related list form
        var dataTemplate = JSON.parse(JSON.stringify(component.get('v.DataTemplate')));
        // set parent id if available
        if(component.get('v.ParentId') != '' && component.get('v.ParentId') != undefined){
            dataTemplate[component.get('v.RelatedField')] = component.get('v.ParentId');
        }
        
        var index = component.get('v.Data').length;
        component.set('v.Data['+ index +']', dataTemplate);
        var data = component.getReference('v.Data['+ index +']');
        
        $A.createComponent(
                'c:S360_FormBuilderMain',
                {
                    "aura:id": 'form',
                    "formConfigName": component.get('v.FormName'),
                    "FormConfig": component.get('v.FormConfigTemplate'),
                    "FieldInfo": component.get('v.FieldInfoTemplate'),
                    "Data": data,
                },
                function(newComponent, status, errorMessage){
                    if(status){
                    	body.push(newComponent);
                        component.set('v.body', body);
                    }
                });
    },
    
    /**
     * get related data and construct that form based on related data
     */
    getAndCustrunctRelatedData: function(component){
        var self = this;
        
        // if related field not set up properly, exit this process
        if(component.get('v.FieldInfoTemplate')[component.get('v.RelatedField')] == undefined ||
          	component.get('v.FieldInfoTemplate')[component.get('v.RelatedField')] == ''){
            component.set('v.IsReady', true);
        	return;    
        }
        
        // if parent id empty, exit this process
        if(component.get('v.ParentId') == undefined || component.get('v.ParentId') == ''){
            component.set('v.IsReady', true);
            return;
        }
        
        var fields = component.get('v.FormConfigTemplate').Field__c;
        var sobject = component.get('v.FormConfigTemplate').Primary_Object__c;
        var cWhere = component.get('v.FieldInfoTemplate')[component.get('v.RelatedField')].relationshipApi + '.Id = \'' 
        				+ component.get('v.ParentId') + '\'';
        
        var action = component.get('c.getRelatedData');
        action.setParams({
            "fields" : fields,
            "sFrom" : sobject,
            "cWhere" : cWhere
        });
        action.setCallback(this, function(response){
            if(component.isValid() && response.getState() == 'SUCCESS'){
                var res = response.getReturnValue();
                debugger;
                if(res.length > 0){
                    res.forEach(function(record){
                        // populate the dat to field
                        record = self.populateData(component.get('v.FormConfigTemplate'), record);
                        var body = component.get('v.body');
                        var index = component.get('v.Data').length;
                        
                        component.set('v.Data['+ index +']', record);
                        var data = component.getReference('v.Data['+ index +']');
                        
                        $A.createComponent(
                            'c:S360_FormBuilderMain',
                            {
                                "aura:id": 'form',
                                "formConfigName": component.get('v.FormName'),
                                "FormConfig": component.get('v.FormConfigTemplate'),
                                "FieldInfo": component.get('v.FieldInfoTemplate'),
                                "Data": data,
                            },
                            function(newComponent, status, errorMessage){
                                if(status){
                                    body.push(newComponent);
                                    component.set('v.body', body);
                                }
                            }); 
                    });
                }
                
                // remove loading
                component.set('v.IsReady', true);
            }
        });
        $A.enqueueAction(action);
    },
    
    deleteRecordHelper: function(component, event){
        var self = this;
        var index = event.getParam("Payload");
        var data = component.get('v.Data');
        var body = component.get('v.body');
        
        var action= component.get('c.deleteRecords');
        action.setParams({
            "obj" : data[index].sobjectType,
            "lid" : "'" + data[index].Id + "'"
        });
        action.setCallback(this, function(response){
            if(component.isValid() && response.getState() == 'SUCCESS'){
                var res = response.getReturnValue();
                if(res.status == true){
                    // remove data from v.Data and component
                    body.splice(index, 1);
                    data.splice(index, 1);
                    
                    component.set('v.body', body);
                    component.set('v.Data', data);
                    
                    this.showToast(component, 'success', 'Success delete record');
                }else{
                    this.showToast(component, 'error', 'Failed delete record : ' + res.message);
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    populateData : function(formConfig, data){
        var item = {
            'sobjectType': formConfig.Primary_Object__c,
            'Id': (data != undefined && data['Id']) ? data['Id'] : undefined,
            'Name': (data != undefined && data['Name']) ? data['Name'] : undefined,
        };
        if(formConfig.Field__c){
            formConfig.Field__c.split(',').forEach(function(field){
                if(data != undefined && data[field]){
                    item[field] = data[field];
                }else{
                    item[field] = '';
                }
                
            });    
        }
        
        return item;
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
})