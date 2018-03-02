({
	_showSelf : function(cmp,evt,hlp){
		cmp.set('v.visible', 'true');
		cmp.set('v.backgroundClass', '');

	},
	_hideSelf : function(cmp, evt, helper){
		cmp.set('v.class', 'alert ' + cmp.get('v.class') + ' fade');
		cmp.set("v.backgroundClass", ' fade');
	}
})