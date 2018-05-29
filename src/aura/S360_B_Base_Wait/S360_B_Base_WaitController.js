({
	showWait : function(component, event, helper) {
		////debugger;
		var waitTarget = component.find("S360_Base_Wait");

		var params = event.getParam('arguments');

		var showWait = params.showWait;

		component.set('v.message', params.message);

		if(showWait)
		{
			$A.util.addClass(waitTarget, 'show');
			$A.util.removeClass(waitTarget, 'hide');
			$A.util.removeClass(waitTarget, 'fade');

		}else
		{
			$A.util.addClass(waitTarget, 'hide');
			$A.util.addClass(waitTarget, 'fade');
			$A.util.removeClass(waitTarget, 'show');
		}
		

	}
})