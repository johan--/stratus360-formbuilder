({
	handleOnClick : function(comp, event, hlp) {
		switch(event.getParam('CompId')){
            case 'btn_delete_attach_' + comp.get('v.CompId') :
                event.stopPropagation();
                if(comp.get('v.data').objects.Id){
                	//hlp.deleteAttachment(comp);
                    hlp.deleteFile(comp);
                }else{
                	var allData = comp.get('v.allData');
                    allData.splice(comp.get('v.index'), 1);
                    
                    comp.set('v.allData', allData);
                }
                
                break;
        }
	}
})