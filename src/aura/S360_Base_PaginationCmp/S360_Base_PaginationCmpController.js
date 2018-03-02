({
    handlePageReady : function(comp, evt, hlp){
        if(evt.getParam('CompId') == comp.get('v.CompId')){
         	comp.set('v.length', evt.getParam('length'));
            comp.set('v.pageSize', evt.getParam('pageSize'));
            comp.set('v.offset', evt.getParam('offset'));
            console.log(parseInt(evt.getParam('offset')));
            if(parseInt(evt.getParam('offset')) == 0){
                comp.set('v.currentPage', 0);   
            }
            
            hlp.setupNumberOfPage(comp);
            hlp.setUpPagination(comp);
            
            //notify page number picklist
            var event = $A.get('e.c:NotifyPicklistCmp');
            event.setParams({
                'CompId': comp.get('v.pageNumberPicklist')
            });
            event.fire();   
        }
    },
    
    methodHandlePageReady : function(comp, evt, hlp){
        var param = evt.getParam('arguments');
        if(param){
            comp.set('v.length', param.length);
            comp.set('v.pageSize', param.pageSize);
            comp.set('v.offset', param.offset);
            
            if(parseInt(param.offset) == 0){
                comp.set('v.currentPage', 0);   
            }
            
            hlp.setupNumberOfPage(comp);
            hlp.setUpPagination(comp);
            
            //notify page number picklist
            var event = $A.get('e.c:NotifyPicklistCmp');
            event.setParams({
                'CompId': comp.get('v.pageNumberPicklist')
            });
            event.fire(); 
        }
    },
    
    handleOnClick : function(comp, evt, hlp){
        switch(evt.getParam('CompId')){
            case comp.get('v.buttonPrev') : 
                hlp.prev(comp, evt, hlp);
                break;
			case comp.get('v.buttonNext') : 
                hlp.next(comp, evt, hlp);
                break;
            default :
                console.log('none');
        }
    },
    
    handleOnChange : function(comp, evt, hlp){
        switch(evt.getParam('CompId')){
			case comp.get('v.recordPerPagePicklist') :
                hlp.changeRecordPerPage(comp, hlp, evt.getParam('payload'));
                break;
          	case comp.get('v.pageNumberPicklist') :
                hlp.changePage(comp, hlp, evt.getParam('payload'));
                break;
            default :
                console.log('none');
        }
    }
})