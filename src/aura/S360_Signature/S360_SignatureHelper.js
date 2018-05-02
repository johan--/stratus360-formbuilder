({
    handleInit : function(component, event) {
        //var canvas = document.getElementById('signature-pad');</h5>
        // Fix tab switching issue
        
        
        var canvas = component.find('signature-pad').getElement();
        
        //var ratio = Math.max(window.devicePixelRatio || 1, 1);
        //ratio = 1;
        //canvas.width = canvas.offsetWidth * ratio;
        //canvas.height = canvas.offsetHeight * ratio * 1.5;
        //canvas.getContext("2d").scale(ratio, ratio);
        
        
        var self = this;
        canvas.height = 150;
        
        self.handleCanvasWidth(component, canvas.parentNode, canvas);
        component.set('v.canvas', canvas);
        
        window.addEventListener("resize", function(){
            self.handleCanvasWidth(component, canvas.parentNode, canvas);
        });
        
        var signaturePad = new SignaturePad(canvas);
        component.set("v.signaturePad", signaturePad);
        
        this.getSignature(component);
    },
    handleSaveSignature : function(component, event) {
        var action = component.get("c.upsertSignature");
        var sig = component.get("v.signaturePad");
        action.setParams({
            "demoReportId": component.get("v.recordId"),
            "b64SignData": sig.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                this.clearCanvas(component, event);
                var errorReturned = response.getReturnValue();
                
                if(errorReturned == ''){
                    this.showToast(component,true, '');
                    $A.get('e.force:refreshView').fire();
                } else {
                    console.log(errorReturned); // Technical error for maintenance
                    this.showToast(component,false, $A.get("$Label.c.Signature_Error_Report_Already_Submitted"));
                }
            }
        });
        $A.enqueueAction(action);
    },
    clearCanvas : function(component, event) {
        var sig = component.get("v.signaturePad");
        sig.clear();
    },
    showToast: function(component,isSuccess, error){
        var toastEvent = $A.get("e.force:showToast");
        var type = isSuccess ? "success" : "error";
        var title = isSuccess ? $A.get("$Label.c.Signature_Toast_Title_Success") : $A.get("$Label.c.Signature_Toast_Title_Error");
        var message = isSuccess ? $A.get("$Label.c.Signature_Toast_Text_Success") : error;
        toastEvent.setParams({
            "type": type,
            "title": title,
            "message": message,
            "mode": "pester"
        });
        toastEvent.fire();
    },
    getSignature: function(component){
        if(!component.get('v.recordId')){
        	return;    
        }
        
		var action = component.get("c.getSignature");
        action.setParams({
            "parentId": component.get('v.recordId'),
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var img = new Image();
                img.onload = function(){
                    var canvas = component.find('signature-pad').getElement();
                    var destCtx = canvas.getContext('2d');
                    
                    debugger;
					var scaleFactor = 1;
                    var y = 0;
                    var x = 0;
                    if(canvas.width < img.width){
                        scaleFactor = canvas.width / img.width;
                        
                        img.height = img.height * scaleFactor
                        img.width = canvas.width;
                    }else{
                        x = (canvas.width - img.width) / 2;
                    }
                    
                    y = (canvas.height - img.height) / 2;
                    
                    //destCtx.scale(scaleFactor,scaleFactor);
        			destCtx.drawImage(img, x, y, img.width, img.height);
        			//destCtx.drawImage(img, 0, 0);
                }
                img.src = 'data:image/png;base64,' + response.getReturnValue();
            }
        });
        $A.enqueueAction(action);
    },
    
    handleCanvasWidth: function(component, canvasContainer, canvas){
        canvas.width = canvasContainer.clientWidth;
        component.set('v.canvas', canvas);
    },
    
    /**
     * get and crop the canvas base on the signature
     */
    getExactSignatureDataUrl: function(canvas){
        var ctx = canvas.getContext('2d');
        
        var w = canvas.width,
            h = canvas.height,
            pix = {x:[], y:[]},
            imageData = ctx.getImageData(0,0,canvas.width,canvas.height),
            x, y, index;
        
        for (y = 0; y < h; y++) {
            for (x = 0; x < w; x++) {
                index = (y * w + x) * 4;
                if (imageData.data[index+3] > 0) {
                    
                    pix.x.push(x);
                    pix.y.push(y);
                    
                }   
            }
        }
        pix.x.sort(function(a,b){return a-b});
        pix.y.sort(function(a,b){return a-b});
        var n = pix.x.length-1;
        
        w = pix.x[n] - pix.x[0];
        h = pix.y[n] - pix.y[0];
        var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);
        
        
        var hl = document.createElement('canvas');
        hl.width = w;
        hl.height = h;
        
        hl.getContext('2d').putImageData(cut, 0,0);
        
        return hl.toDataURL();
    }
})