({
    handleEvent : function(component, event, helper) {
        if(component.get('v.CompId') == event.getParam('CompId')){
            document.getElementById('loading').style.display="block";
            console.log(document.getElementById('loading').style.display);
            //component.set('v.show', event.getParam('IsShow'));
        }
    },

    setLoading: function(comp, evt, hlp){
        var param = evt.getParam('arguments');
        if(param){
            comp.set('v.show', param.isShow);
        }
    }
})