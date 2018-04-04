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
        var out = this.injectTheDocx(component, event, helper);
        
        var reader = new FileReader();
        reader.onload = function() {
            var dataUrl = reader.result;
            helper.download(component, dataUrl);
            
        };
        reader.readAsDataURL(out);
    },
    
    printAsPDF : function(component, event, helper){
        var out = this.injectTheDocx(component, event, helper);
        var self = this;
        var reader = new FileReader();
        reader.onload = function() {
            var arrayBuffer = reader.result;
            mammoth.convertToHtml({arrayBuffer: arrayBuffer})
            .then(function(result){
                console.log(result.value)
                window.open('https://s360-fa-dev-ed--s360-fa.na54.visual.force.com/apex/S360_Base_PrintPDF?d='+encodeURI(self.unEscapeHtml(result.value)), '_blank');
            }).done();
            
        };
        reader.readAsArrayBuffer(out);
    },
    
    injectTheDocx : function(component, event, helper){
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
        });
        
        return out;
    },
    
    unEscapeHtml : function(value){
        return value
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot/g, '"')
        	.replace(/&#96;/g, '`')
        	.replace(/&#x27;/g, "'");
    },
    
    
    /*test*/
    test:function(theUrl){
        var xmlhttp;
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                return xmlhttp.responseText;
            }
        }
        xmlhttp.open("GET", 'https://s360-fa-dev-ed--s360-fa.na54.visual.force.com/resource/1522320358000/S360_FA__docx', false );
        debugger;
        xmlhttp.send();
    }
    
})