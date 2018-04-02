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
    
    download: function(component, fileContents){
        var element = document.createElement('a');
        element.setAttribute('href', fileContents);
        element.setAttribute('download', component.get('v.TemplateName'));
        
        element.style.display = 'none';
        document.body.appendChild(element);
        
        element.click();
        
        document.body.removeChild(element);
    },
    
    printAsDocx : function(component, event, helper){
        var fileLoad = component.get('v.TemplateData');
        var byteString = atob(fileLoad);
        var zip = new JSZip(byteString);
        
        var doc = new Docxtemplater().loadZip(zip);
        doc.setOptions({
            nullGetter:function(tag, props) {
                return '';
            }
        });
        
        var dataToInject = component.get('v.DataToInject');
        if(!dataToInject){
            dataToInject = {};
        }
        doc.setData(dataToInject);
        
        try {
            doc.render()
        }
        catch (error) {
            var e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties,
            }
            console.log(JSON.stringify({error: e}));
            throw error;
        }
        
        var out=doc.getZip().generate({
            type:"blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document; charset=UTF-8",
        })
        
        var reader = new FileReader();
        reader.onload = function() {
            var dataUrl = reader.result;
            
            helper.download(component, dataUrl);
            
        };
        reader.readAsDataURL(out);
    }
})