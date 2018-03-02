({
	handleTemplateRetrieved : function(component, event, helper) {
        // get related data and construct that form based on related data
        helper.getAndCustrunctRelatedData(component);
	},
    
    handleButtonClick : function(component, event, helper){
        switch(event.getParam("CompId")){
            case ('new_' + component.get('v.FormName') + '_' + component.get('v.ParentId')):
                event.stopPropagation();
                
                helper.crateListItem(component, event, helper);
                
                break;
            case ('remove_' + component.get('v.FormName') + '_' + component.get('v.ParentId')):
                event.stopPropagation();
                
                // is record has an id, confirm and do server deletation
                if(component.get('v.Data')[event.getParam('Payload')].Id != undefined && 
                   component.get('v.Data')[event.getParam('Payload')].Id != ''){
                    if(confirm('Are you sure delete this record?')){
                        helper.deleteRecordHelper(component, event);
                    }
                }else{
                    var index = event.getParam("Payload");
                    var data = component.get('v.Data');
                    var body = component.get('v.body');
                    
                    body.splice(index, 1);
                    data.splice(index, 1);
                    
                    component.set('v.body', body);
                    component.set('v.Data', data); 
                }
                
                break;
        }
    }
})