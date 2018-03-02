({

    onClick : function(c,e,h){

        if(e.getParam('CompId') == 'ButtonDismiss'){
            //Modal was dismissed; do not proceed
            c.set('v.show', 'false');    
            e.stopPropagation();
            var evtClone = c.getEvent('OnClick');
            evtClone.setParams({
                "CompId": 'dismissedSwitch',
                'payload': 0
            });
            evtClone.fire();
        } 
        if(e.getParam('CompId') == 'ButtonConfirm'){
            //Received confirmation - allow event to propogate and dismiss modal
            var evt = c.get('v.evt');
            if(evt){
                var evtClone = c.getEvent('OnClick');
                evtClone.setParams({
                    "CompId": 'confirmedSwitchBetweenPIFAndDeclaration',
                    'payload': c.get('v.activeComponentOnConfirm')
                });
                evtClone.fire();
            }
            c.set("v.show", 'false');
            e.stopPropagation();
        }
    },
})