({
	openCamera : function(comp) {
		var input = document.getElementById(comp.get('v.CompId'));
        input.click();
	},
    
    handleCameraCaptured: function(comp){
        var file = document.getElementById(comp.get('v.CompId')).files[0];
        if(file){
            var fr = new FileReader();

            var self = this;
            fr.onloadend = function() {
                var fileContents = fr.result;
                var evt = comp.getEvent('OnChange');
                evt.setParams({
                    "CompId": comp.get('v.CompId'),
                    "payload": {
                        name: file.name,
                        type: file.type,
                        contents: fileContents
                    }
                });
                evt.fire();
                
                document.getElementById(comp.get('v.CompId')).value='';
            };
    
            fr.readAsDataURL(file);
        }
    }
})