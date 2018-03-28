({
    scriptsLoaded : function(component, event, helper) {
        helper.downloadTemplateHelper(component);
    },
    
    onClick: function(component, event, helper){
        var fileLoad = component.get('v.TemplateData');
        console.log(fileLoad);
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
            
            console.log(out);
            helper.download(component, out, dataUrl);
            
        };
        reader.readAsDataURL(out);
    }
})