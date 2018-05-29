({
	showToast: function(comp, type, message){
        comp.set('v.TextMessage', message);
        comp.set('v.ToastType', type);
        var toastValue = comp.get('v.showToast');
        if(toastValue)
        {
            comp.set('v.showToast',false);
        }else
        {
            comp.set('v.showToast',true);
        }
        
    },
    
    deleteAttachment : function(comp){
        //debugger;
        comp.set('v.showLoading', true);
        var self = this;
        
        var action = comp.get('c.deleteAttachment');
        action.setParams({
            "attachmentId": comp.get('v.data').objects.Id
        });
        action.setCallback(this, function(res){
            if(comp.isValid() && res.getState() == 'SUCCESS'){
                if(res.getReturnValue().status){
                    //self.showToast(comp, 'success', $A.get('$Label.c.success_delete_expense_report_attachment'));
                    
                    // test remove
                    var allData = comp.get('v.allData');
                    allData.splice(comp.get('v.index'), 1);
                    
                    comp.set('v.allData', allData);
                    
                    //alert($A.get('$Label.c.success_delete_expense_report_attachment'));
                }else{
                    var errorMessage = [];
                    res.getReturnValue().messages.forEach(function(e){
                        errorMessage.push(e);
                    });
                    //alert($A.get('$Label.c.failed_delete_expense_report_attachment') + ' : (' + errorMessage.join(',') + ')');
                    //self.showToast(comp, 'error', $A.get('$Label.c.failed_delete_expense_report_attachment') + ' : (' + errorMessage.join(',') + ')');
                } 
            }else if(res.getState() == 'ERROR'){
                var errorMessage = [];
                var error = res.getError();
                if(error){
                    error.forEach(function(e){
                        errorMessage.push(e.message);
                    });
                    //alert($A.get('$Label.c.failed_delete_expense_report_attachment') + ' : (' + errorMessage.join(',') + ')');
                    //self.showToast(comp, 'error', $A.get('$Label.c.failed_delete_expense_report_attachment') + ' : (' + errorMessage.join(',') + ')');
                } 
            }
            
            //hide loading spinner
        	comp.set('v.showLoading', false);
        });
        $A.enqueueAction(action);
    }
})