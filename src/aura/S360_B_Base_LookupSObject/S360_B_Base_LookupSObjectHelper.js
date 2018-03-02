({
    /**
     * Perform the SObject search via an Apex Controller
     */
    doSearch : function(cmp) {
        // Get the search string, input element and the selection container
        var searchString = cmp.get('v.searchString');
        var inputElement = cmp.find('lookup');
        var lookupList = cmp.find('lookuplist');
        // Clear any errors and destroy the old lookup items container
        inputElement.set('v.errors', null);
        //alert('@@serach string length@@'+searchString.length);
        // We need at least 2 characters for an effective search
        if (typeof searchString === 'undefined'){
            cmp.set("v.showDropdownList",true);
            // Hide the lookuplist
            //alert('hidding');
            //$A.util.addClass(lookupList, 'slds-hide');
            return;
        }
       
        // Get the API Name
        var sObjectAPIName = cmp.get('v.sObjectAPIName');

        // Create an Apex action
        var action = cmp.get('c.lookup');

        // Mark the action as abortable, this is to prevent multiple events from the keyup executing
        action.setAbortable();
		// console.log('dependantField===',cmp.get('v.dependantField'));
        // console.log('dependantFieldType===',cmp.get('v.dependantFieldType'));
        // console.log('dependantFieldValue===',cmp.get('v.dependantFieldValue'));

        // Set the parameters
        action.setParams({ 
            "searchString" : searchString, 
            "sObjectAPIName" : sObjectAPIName,
            "whereClause" : cmp.get('v.dependantField'), 
            "whereClauseType" : cmp.get('v.dependantFieldType'), 
            "whereClauseValue" : cmp.get('v.dependantFieldValue')
        });

        // Define the callback
        action.setCallback(this, function(response) {
            var state = response.getState();

            // Callback succeeded
            if (cmp.isValid() && state === "SUCCESS"){
                // Get the search matches
                var matches = response.getReturnValue();
                // If we have no matches, return nothing
                if (matches.length == 0){
                    cmp.set('v.matches', null);
                    return;
                }

                cmp.set('v.matches', matches);                   

                // var exchangeEvt = cmp.getEvent("AutoFillExchange");
                // if(matches[0].exchange && (['tsx','tsx-v','tsxv'].indexOf(matches[0].exchange.toLowerCase()) > -1 )){
                //     var exchangeEvt = cmp.getEvent("AutoFillExchange");
                //     exchangeEvt.setParams({
                //         'CompId': "Base_Lookup_SObject",
                //         //strip non-alphanumeric characters
                //         'payload': matches[0].exchange.replace(/\W/g,'')
                //     });
                // }
                // else{
                //     exchangeEvt.setParams({
                //         'CompId': "Base_Lookup_SObject",
                //         'payload': ""
                //     }); 
                // }
                // exchangeEvt.fire();
             }
            else if (state === "ERROR") // Handle any error by reporting it
            {
                var errors = response.getError();
                
                if (errors) 
                {
                    if (errors[0] && errors[0].message) 
                    {
                        this.displayToast('Error', errors[0].message);
                    }
                }
                else
                {
                    this.displayToast('Error', 'Unknown error.');
                }
            }
        });
        
        // Enqueue the action                  
        $A.enqueueAction(action);
    },

    /**
     * Handle the Selection of an Item
     */
    handleSelection : function(cmp, event) {
        // Log the Object Id and Label to the console
        // console.log('objectId=' + objectId);
        // console.log('objectLabel=' + objectLabel);
        // Create the UpdateLookupId event
        var updateEvent = cmp.getEvent("LookupSObjectUpdateEvt");

        // Get the Instance Id of the Component
        var instanceId = cmp.get('v.instanceId');

        if(!event.currentTarget){
            //Handle freeform select
            updateEvent.setParams({
                "sObjectId": '', //JUST SET BLANK ID AND HOPEFULLY IT WORKS? ¯\_(ツ)_/¯
                "instanceId": instanceId ? instanceId.toString() : "Not specified",
                "sObjectName": cmp.get('v.searchString')
            });
            
            window.dismissLookupDropdown = function(){
                this.set("v.showDropdownList", false);
            }.bind(cmp);
            //Hide dropdown if user is not just about to click through to dropdown menu
            window.setTimeout(window.dismissLookupDropdown, 250);
            updateEvent.fire()
        }
        else{
            // Resolve the Object Id from the events Element Id (this will be the <a> tag)
            var objectId = this.resolveId(event.currentTarget.id);
            // console.log(event.currentTarget.id);
            // The Object label is the inner text)
            var objectLabel = event.currentTarget.innerText.trim();
            cmp.set("v.searchString",objectLabel);
            //Handle dropdown item select
            //TODO: implement custom functions

            //Clear timeout function if it exists
            window.clearTimeout(window.dismissLookupDropdown);
            cmp.set('v.showDropdownList', false);
        }

        // Update the Searchstring with the Label
        cmp.set("v.searchString", objectLabel);
		cmp.set("v.searchStringId", objectId);
    },

    /**
     * Clear the Selection
     */
    clearSelection : function(cmp) {
        // Create the ClearLookupId event
        var clearEvent = cmp.getEvent("LookupSObjectClearIdEvt");

        // Get the Instance Id of the Component
        var instanceId = cmp.get('v.instanceId');

        // Populate the event with the Instance Id
        clearEvent.setParams({
            "instanceId" : instanceId
        });
        
        // Fire the event
        clearEvent.fire();
        
        // Clear the Searchstring
        cmp.set("v.searchString", '');

    },

    /**
     * Resolve the Object Id from the Element Id by splitting the id at the _
     */
    resolveId : function(elmId)
    {
        var i = elmId.lastIndexOf('_');
        return elmId.substr(i+1);
    },

    /**
     * Display a message
     */
    displayToast : function (title, message) 
    {
        var toast = $A.get("e.force:showToast");

        // For lightning1 show the toast
        if (toast){
            //fire the toast event in Salesforce1
            toast.setParams({
                "title": title,
                "message": message
            });

            toast.fire();
        }
        else // otherwise throw an alert
        {
            alert(title + ': ' + message);
        }
    },

    valuechange : function(cmp, event) {
        var prepId = cmp.get('v.prepId');

        if(prepId != ""){
            // Hide the Lookup List
            var lookupList = cmp.find("lookuplist");
            $A.util.addClass(lookupList, 'slds-hide');

            // Hide the Input Element
            var inputElement = cmp.find('lookup');
            $A.util.addClass(inputElement, 'slds-hide');

            // Show the Lookup pill
            var lookupPill = cmp.find("lookup-pill");
            $A.util.removeClass(lookupPill, 'slds-hide');

            // Lookup Div has selection
            var inputElement = cmp.find('lookup-div');
            $A.util.addClass(inputElement, 'slds-has-selection');      
        }
        else{
            // Hide the Lookup pill
            var lookupPill = cmp.find("lookup-pill");
            $A.util.addClass(lookupPill, 'slds-hide');

            // Show the Input Element
            var inputElement = cmp.find('lookup');
            $A.util.removeClass(inputElement, 'slds-hide');

            // Lookup Div has no selection
            var inputElement = cmp.find('lookup-div');
            $A.util.removeClass(inputElement, 'slds-has-selection');            
        }
    },
})