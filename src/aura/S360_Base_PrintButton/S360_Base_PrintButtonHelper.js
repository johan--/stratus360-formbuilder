({
    MAX_FILE_SIZE: 11000000, /* 6 000 000 * 3/4 to account for base64 */
    CHUNK_SIZE: 900000, /* Use a multiple of 4 */
    BUTTON_LABEL: '',
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
            }else{
                component.set('v.ButtonLabel', 'Failed Download the Template');
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
    
    saveAsAttachment: function(component, file, fileContents){
        if(!component.get('v.ParentID')){
            this.showToast(component, 'error', 'Print to Attachment Need a Parent Record');
            return;
        }
        
        var base64 = fileContents.split(',')[1];
        var fromPos = 0;
        var toPos = Math.min(base64.length, fromPos + this.CHUNK_SIZE);
        // start with the initial chunk
        this.uploadChunk(component, file, base64, fromPos, toPos, '', this.CHUNK_SIZE);
        
        /*var self = this;
        var base64 = fileContents.split(',')[1];
        var buttonLabel = component.get('v.ButtonLabel');
        component.set('v.ButtonLabel', 'Proccessing...');
        
        var action = component.get("c.saveTheFile");
        action.setParams({
            parentId: component.get('v.ParentID'),
            fileName: component.get('v.TemplateName'),
            base64Data: encodeURIComponent(base64), 
            contentType: file.type
        });
 
        action.setCallback(this, function(response) {
            component.set('v.ButtonLabel', buttonLabel);
            if(component.isValid() && response.getState() == 'SUCCESS'){
                self.showToast(component, 'success', 'Print to Attachment Success');
            }else{
                self.showToast(component, 'error', 'Failed Print to Attachment');
            }
        });
        $A.enqueueAction(action);*/
    },
    
    printAsDocx : function(component, event, helper){
        var out = this.injectTheDocx(component, event, helper);
        
        var reader = new FileReader();
        reader.onload = function() {
            var dataUrl = reader.result;
            
            if(component.get('v.PrintAction') === 'download'){
            	helper.download(component, dataUrl);    
            }else if(component.get('v.PrintAction') === 'saveAsAttachment'){
                helper.saveAsAttachment(component, out, dataUrl);
            }
            
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
    
    uploadChunk : function(component, file, fileContents, fromPos, toPos, attachId, chunkSize) {
        var action = component.get("c.saveTheChunk"); 
        var chunk = fileContents.substring(fromPos, toPos);
        
        if(this.BUTTON_LABEL == ''){
        	this.BUTTON_LABEL = component.get('v.ButtonLabel');    
        }
        component.set('v.ButtonLabel', 'Proccessing...');

        action.setParams({
            parentId: component.get("v.ParentID"),
            fileName: component.get('v.TemplateName'),
            base64Data: encodeURIComponent(chunk), 
            contentType: file.type,
            fileId: attachId
        });        

        var self = this;
        action.setCallback(this, function(a) {
            var state = a.getState();
            if(state == "SUCCESS"){
                attachId = a.getReturnValue();
                fromPos = toPos;
                toPos = Math.min(fileContents.length, fromPos + chunkSize); 
                // recursive method 
                if(fromPos < toPos) {
                    self.uploadChunk(component, file, fileContents, fromPos, toPos, attachId, chunkSize); 
                }else{
                    component.set('v.ButtonLabel', self.BUTTON_LABEL);
                    self.BUTTON_LABEL = '';
                    
                    self.showToast(component, 'success', 'Print to Attachment Success');
                    
                }

            }else if(state == "ERROR"){
                self.showToast(component, 'error', 'Failed Print to Attachment');
            }
        });

        window.setTimeout(
            $A.getCallback(function() {
                $A.enqueueAction(action); 
            }),1000
        );
     
    }
    
})