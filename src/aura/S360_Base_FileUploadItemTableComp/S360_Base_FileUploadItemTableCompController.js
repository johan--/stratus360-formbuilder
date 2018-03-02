({
	handleOnClick : function(comp, event, hlp) {
		switch(event.getParam('CompId')){
            case 'btn_delete_attach_' + comp.get('v.CompId') :
                event.stopPropagation();
                
                hlp.deleteAttachment(comp);
                
                break;
        }
	}
})