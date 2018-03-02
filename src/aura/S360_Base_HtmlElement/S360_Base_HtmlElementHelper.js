({
	generateInnerHtml : function(component) {
		var parent = component.get('v.Parent');
        parent.innerHTML = component.get('v.Content');
        
        // temporary
        var tmp = document.createElement("div");
		tmp.appendChild(parent);
        
        component.set('v.Value', tmp.innerHTML);
	}
})