({
	init : function(component, event, helper) {
		var parent = document.createElement(component.get('v.Tag'));
        parent.className = component.get('v.Class');
        component.get('v.Attributes').forEach(function(attr){
            parent.setAttribute(attr[0], attr[1]);
        });
        
        // temporary div in order to get genereate dom string
        var tmp = document.createElement("div");
		tmp.appendChild(parent);
        component.set('v.Value', tmp.innerHTML);
        component.set('v.Parent', parent);
        
        if(component.get('v.Content') != '' && component.get('v.Content') != undefined)
        	helper.generateInnerHtml(component);
	},
    
    onChange: function(component, event, helper){
        if(component.get('v.Content') != '' && component.get('v.Content') != undefined)
        	helper.generateInnerHtml(component);
    }
})