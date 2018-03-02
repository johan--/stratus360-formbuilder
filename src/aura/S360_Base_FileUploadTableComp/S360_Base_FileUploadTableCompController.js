({
	init : function(comp, evt, hlp){
        
        window.addEventListener('resize', function(){
            hlp.manageTableHeightDimention(comp);
            //hlp.manageTableWidthDimention(comp);
            
            hlp.setTableHeadWidth(comp);
        });
    },
    
    handleDataReady : function(comp, evt, hlp){
        debugger;
        var param = evt.getParam('arguments');
        if(param){
            comp.set('v.sort', param.sort);
            comp.set('v.orderBy', param.orderBy);
            comp.set('v.data', null);
        	comp.set('v.data', param.data);
            
            if(!comp.get('v.isFirstLoaded')){
                comp.set('v.isFirstLoaded', true);
                hlp.manageTableHeightDimention(comp);
                hlp.manageTableWidthDimention(comp);
            }
        }
         
    },
    
    sort : function(comp, evt, hlp){
        var currSort = '';
        var toSort = '';
        
        var currSpan = evt.target;
        var parentAnchor = currSpan.parentElement;
        var parentTh = parentAnchor.parentElement;
        var parentTr = parentTh.parentElement;
        
        if(parentTh.classList.contains('slds-is-sorted--asc')){
            currSort = 'asc';
        }else if(parentTh.classList.contains('slds-is-sorted--desc')){
            currSort = 'desc';
        }
        
        var ite = 0;
        for(ite = 0; ite < parentTr.children.length; ite++){
            if(parentTr.children[ite].classList.contains('slds-is-sorted')){
                parentTr.children[ite].classList.remove('slds-is-sorted');
                parentTr.children[ite].classList.remove('slds-is-sorted--asc');
                parentTr.children[ite].classList.remove('slds-is-sorted--desc');
            }
        }
        
        if(currSort == 'asc'){
            toSort = 'desc';
            parentTh.classList.add('slds-is-sorted--desc');
        }else if(currSort == 'desc'){
            toSort = 'asc';
            parentTh.classList.add('slds-is-sorted--asc');
        }else{
            toSort = 'desc';
            parentTh.classList.add('slds-is-sorted--desc');
        }
        parentTh.classList.add('slds-is-sorted');
        
        var field = '';
        var c = currSpan.className;
        field = c.substring(c.indexOf('@') + 1, c.indexOf('~'));
        
        //arrow in slds is reverse of sorting in salesforce, so reverse it before send to salesforce
        if(toSort == 'asc'){
            toSort = 'desc';
        }else{
            toSort = 'asc';
        }
        
        comp.set('v.sort', toSort);
        comp.set('v.orderBy', field);
        
        var event = comp.getEvent('notifyTableCanged');
        event.setParams({
            "sort": comp.get('v.sort'),
            "orderBy": comp.get('v.orderBy')
        });
        event.fire();
    },
    
    startResizeTableColumn : function(comp, evt, hlp){
        var p = hlp.findParent(hlp, evt.target.parentElement, 't-header');
        
        comp.set('v.objectToResize', p);
        comp.set('v.initResizeDimen', {w: p.offsetWidth, y: p.offsetHeight});
        comp.set('v.initResizePos', {x: evt.clientX, y: evt.clientY});
        comp.set('v.isResizing', true);
        //comp.set('v.isMouseMoveActive', true);
    },
    
    handleMouseUp : function(comp, evt, hlp){
        if(comp.get('v.objectToResize')){
            var columnWidth = comp.get('v.columnWidth');
            
            columnWidth[comp.get('v.objectToResize').cellIndex] = comp.get('v.objectToResize').offsetWidth;
            
            comp.set('v.columnWidth', columnWidth);
            comp.set('v.initTableWidth', comp.get('v.tableWidth'));
            
        }
        
        //comp.set('v.isMouseMoveActive', false);
        comp.set('v.isResizing', false); 

        //Resize table height
        //comp.set('v.CompId',comp.get('v.tableExpenseEPayId'));
        hlp.manageTableHeightDimention(comp);
        hlp.setTableHeadWidth(comp);
    },
    
    handleMouseMove : function(comp, evt, hlp){
        //if(comp.get('v.isMouseMoveActive')){
        	if(comp.get('v.isResizing')){
                if(comp.get('v.objectToResize')){
                    var nWidth =  comp.get('v.initResizeDimen').w + evt.clientX - comp.get('v.initResizePos').x;
                    var nTableWidth = comp.get('v.initTableWidth') + (evt.clientX - comp.get('v.initResizePos').x);
                    
                 	comp.get('v.objectToResize').style.width = nWidth+'px';
                    comp.set('v.tableWidth', nTableWidth);
                }
            }
        //}
    },
    
    invalidateHeight : function(comp, evt, hlp){
        hlp.manageTableHeightDimention(comp);
        hlp.setTableHeadWidth(comp);
    },
    
    manageScroll : function(comp, evt){
        comp.find('table-head-container').getElement().scrollLeft = evt.srcElement.scrollLeft;
    }
})