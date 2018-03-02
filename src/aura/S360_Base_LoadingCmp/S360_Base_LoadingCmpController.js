({
	setLoading: function(comp, evt, hlp){
        var param = evt.getParam('arguments');
        if(param){
            comp.set('v.Show', param.isShow);
        }
    }
})