({
    doInit : function(component, event, helper) {
        //Send LC Host as parameter to VF page so VF page can send message to LC; make it all dynamic
        component.set('v.lcHost', window.location.hostname);
		// debugger;
        var frameSrc = 'https://pifdev-pifdev.cs66.force.com/pif/S360_FileUpload_VF?id=' + component.get('v.recordId') + '&lcHost=' + component.get('v.lcHost');
        console.log('frameSrc:' , frameSrc);
        component.set('v.frameSrc', frameSrc);
    }
    
})