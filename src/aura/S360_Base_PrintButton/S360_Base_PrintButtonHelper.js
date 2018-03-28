({
	downloadTemplateHelper : function(component) {
        var buttonLabel = component.get('v.ButtonLabel');
        component.set('v.ButtonLabel', 'Downloading template...');
        
		var action = component.get('c.downloadTemplate');
        action.setParams({
            attachmentId: component.get('v.TemplateID')
        });
        action.setCallback(this, function(response){
            if(component.isValid() && response.getState() == 'SUCCESS'){
                component.set('v.ButtonLabel', buttonLabel);
                component.set('v.TemplateData', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
	},
    
    download: function(component, file, fileContents){
        var element = document.createElement('a');
        element.setAttribute('href', fileContents);
        element.setAttribute('download', file.name);
        
        element.style.display = 'none';
        document.body.appendChild(element);
        
        element.click();
        
        document.body.removeChild(element);
    }
})