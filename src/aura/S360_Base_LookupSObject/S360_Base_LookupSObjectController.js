({
    /**
     * Search an SObject for a match
     */
	search : function(cmp, event, helper) {
        //alert(cmp.get('v.searchString') );
		helper.doSearch(cmp);        
    },

    /**
     * Select an SObject from a list
     */
    select: function(cmp, event, helper) {
    	helper.handleSelection(cmp, event);
    },
    
    /**
     * Clear the currently selected SObject
     */
    clear: function(cmp, event, helper) {
    	helper.clearSelection(cmp);    
    },
    handleValueChange : function (cmp, event, helper) {
        // handle value change
        //console.log("cmp: " + cmp.get('v.instanceId'));
        //alert(cmp.get('v.prepId'));
        //console.log("old value: " + event.getParam("oldValue"));
        //console.log("current value: " + event.getParam("value"));
        //cmp.set("v.searchString", 'XXX');
        console.log('prep id');
        helper.valuechange(cmp, event);
    },
    
    methodHandleClearLookup : function(cmp, event, helper) {
        helper.clearSelection(cmp);   
    },
    
    methodHandlePrepare : function(cmp, event, helper){
        if(!cmp.get('v.IsDisabled')){
        	helper.handlePrepare(cmp, event, helper);    
        }
    },
    
    onblur : function(comp, evt, hlp){
        setTimeout(function(){
            var lookupList = comp.find("lookuplist");
            
            if(!lookupList){
                return;
            }
            
            $A.util.addClass(lookupList, 'slds-hide');
            lookupList.getElement().classList.add('slds-hide');
            
            if(!comp.get('v.isSelected')){
                comp.set('v.searchString', '');
            }
            
            comp.set('v.isSelected', false);
        }, 500);
    },
    
    handleSearchStringChange : function(comp){
        console.log('xxx = ' + comp.get('v.isInitSearchString'));
        if(comp.get('v.isInitSearchString')){
            comp.set('v.isInitSearchString', false);
            comp.set('v.oldSearchString', comp.get('v.searchString'));
            
            console.log(comp.get('v.searchString') + ' = ' + comp.get('v.oldSearchString'));
        }else{
         	if(comp.get('v.IsDisabled')){
                comp.set('v.searchString', comp.get('v.oldSearchString'));
            }   
        }
        
        console.log('yy = ' + comp.get('v.isInitSearchString'));
    }

})