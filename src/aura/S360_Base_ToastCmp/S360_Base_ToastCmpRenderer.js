({
	// Your renderer method overrides go here
    afterRender: function (component, helper) {
        this.superAfterRender();
        console.log(component.find('ToastID').getElement());
        console.log(component.find('ToastID').getElement().getBoundingClientRect());
        component.find('ToastID').getElement().style.top = 10 - component.find('ToastID').getElement().getBoundingClientRect();
    },
})