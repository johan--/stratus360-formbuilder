({
    setUpPagination: function(comp){
        if(comp.get('v.length') <= 0){
            comp.set('v.isPrev', false);
            comp.set('v.isNext', false);
        }else{
            if(comp.get('v.length') > comp.get('v.pageSize') + comp.get('v.offset')){
                comp.set('v.isNext', true);
            }else{
                comp.set('v.isNext', false);
            }
            
            if(comp.get('v.offset') > 0){
                comp.set('v.isPrev', true);
            }else{
                comp.set('v.isPrev', false);
            }
        }
    },
    
    setupNumberOfPage : function(comp){
        var numberOfPage = [];
        
        if(comp.get('v.length') <= comp.get('v.pageSize')){
            numberOfPage.push(1);
        }else{
            var x = parseInt((comp.get('v.length') / comp.get('v.pageSize')));
            
        	for(var i = 1; i <= x; i++ ){
                numberOfPage.push(i);
            }
            
            if(comp.get('v.length') % comp.get('v.pageSize') != 0){
                numberOfPage.push(x + 1);
            }
        }
        comp.set('v.numberOfPage', numberOfPage.join(','));
    },
    
    changeRecordPerPage : function(comp, hlp, pageSize){
        comp.set('v.offset', 0);
        comp.set('v.pageSize', parseInt(pageSize));
        
        comp.set('v.currentPage', 0);
        hlp.setupNumberOfPage(comp);
        hlp.validate(comp, hlp);
    },
    
	validate : function(comp, hlp) {
        hlp.setUpPagination(comp);
        
        var evt = comp.getEvent('paginationEvent');
        evt.setParams({
            "offset": comp.get('v.offset'),
            "pageSize": comp.get('v.pageSize'),
            "length": comp.get('v.length'),
        });
        evt.fire();
	},
    
    /**
     * action = 1 if press next button
     * action = -1 if press prev button
     */
    setPageNumber : function(comp, action){
        
        var x = comp.get('v.numberOfPage');
        
        if(action){
            x[comp.get('v.currentPage') - action].selected = false;
        }
        
        x[comp.get('v.currentPage')].selected = true;
        comp.set('v.numberOfPage', x);
    },
    
    
    
	prev : function(comp, evt, hlp) {
		var offset = comp.get('v.offset');
        var size = comp.get('v.pageSize');
        
        comp.set('v.offset', offset - size);
        hlp.validate(comp, hlp);
        
        comp.set('v.currentPage', comp.get('v.currentPage') - 1);
	},
    
    next : function(comp, evt, hlp) {
		var offset = comp.get('v.offset');
        var size = comp.get('v.pageSize');
        
        comp.set('v.offset', offset + size);
        hlp.validate(comp, hlp);
        
        comp.set('v.currentPage', comp.get('v.currentPage') + 1);
	},
    
    changePage : function(comp, hlp, pageNumber){
        var page = parseInt(pageNumber) - 1;
		
		comp.set('v.currentPage', page);        
        comp.set('v.offset', page * comp.get('v.pageSize'));
        hlp.validate(comp, hlp);
    },
})