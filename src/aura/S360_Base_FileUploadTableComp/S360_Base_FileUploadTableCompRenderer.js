({
	// Your renderer method overrides go here
	afterRender: function(cmp,helper){

        this.superAfterRender();
        helper.setTableHeadWidth(cmp);
   
		if(!cmp.get('v.isDoneRendering')){
            
            cmp.set('v.isDoneRendering', true);
            
            helper.manageTableWidthDimention(cmp);
        
        }
            
	}
})