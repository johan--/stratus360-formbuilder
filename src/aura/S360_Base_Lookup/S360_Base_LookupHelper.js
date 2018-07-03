({
    /**
     * Perform the SObject search via an Apex Controller
     */
    doSearch : function(cmp) {
        // Get the search string, input element and the selection container
        var searchString = cmp.get('v.searchString').trim();
        var inputElement = cmp.find('lookup');
        var lookupList = cmp.find('lookuplist');
        
        // Clear any errors and destroy the old lookup items container
        inputElement.set('v.errors', null);
        
        // We need at least 2 characters for an effective search
        if (typeof searchString === 'undefined' || searchString.length < 2)
        {
            // Hide the lookuplist
            $A.util.addClass(lookupList, 'slds-hide');
            return;
        }

        // Show the lookuplist
        $A.util.removeClass(lookupList, 'slds-hide');
        this.handleDisplayDirection(cmp);

        // Get the API Name
        var sObjectAPIName = cmp.get('v.sObjectAPIName');

        // Create an Apex action
        var action = cmp.get('c.lookup');

        // Mark the action as abortable, this is to prevent multiple events from the keyup executing
        action.setAbortable();

        // Set the parameters
        action.setParams({ 
            "searchString" : searchString, 
            "sObjectAPIName" : sObjectAPIName,
            "whereClause" : cmp.get('v.dependantField'), 
            "whereClauseType" : cmp.get('v.dependantFieldType'), 
            "whereClauseValue" : cmp.get('v.dependantFieldValue'),
            "displayField" : cmp.get('v.displayField')
        });
                          
        // Define the callback
        action.setCallback(this, function(response) {
            var state = response.getState();
            // Callback succeeded
            if (cmp.isValid() && state === "SUCCESS")
            {
                // Get the search matches
                var matches = response.getReturnValue();
                console.log(matches);
                
                // If we have no matches, return nothing
                if (matches.length == 0)
                {
                    cmp.set('v.matches', null);
                    return;
                }
                
                // Store the results
                cmp.set('v.matches', matches);
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
        // select performed
        cmp.set('v.isSelected', true);
        
        // Resolve the Object Id from the events Element Id (this will be the <a> tag)
        var objectId = this.resolveId(event.currentTarget.id);

        // The Object label is the inner text)
        var objectLabel = event.currentTarget.innerText;
                
        // Create the UpdateLookupId event
        var updateEvent = cmp.getEvent("LookupSObjectUpdateEvt");
        
        // Get the Instance Id of the Component
        var instanceId = cmp.get('v.instanceId');
        
        // get which object
        var matches = cmp.get('v.matches');
        var whichObject;
        for(var i = 0; i < matches.length; i++){
            if(matches[i].result.Id == objectId){
                whichObject = matches[i].result;
                break;
            }
        }

        // Populate the event with the selected Object Id and Instance Id
        updateEvent.setParams({
            "sObjectId" : objectId, 
            "instanceId" : instanceId,
            "payload": whichObject
        });

        // Fire the event
        updateEvent.fire();

        // Update the Searchstring with the Label
        cmp.set("v.searchString", objectLabel);

        // Hide the Lookup List
        var lookupList = cmp.find("lookuplist");
        $A.util.addClass(lookupList, 'slds-hide');

        // Hide the Input Element
        var inputElement = cmp.find('lookup');
        $A.util.addClass(inputElement, 'slds-hide');

        // Show the Lookup pill
        var lookupPill = cmp.find("lookup-pill");
        $A.util.removeClass(lookupPill, 'slds-hide');
        $A.util.addClass(lookupPill, 'slds-show');

        // Lookup Div has selection
        var inputElement = cmp.find('lookup-div');
        $A.util.addClass(inputElement, 'slds-has-selection');

        
        //this.validateRequireField(cmp);
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

        // Hide the Lookup pill
        var lookupPill = cmp.find("lookup-pill");
        $A.util.addClass(lookupPill, 'slds-hide');
        $A.util.removeClass(lookupPill, 'slds-show');

        // Show the Input Element
        var inputElement = cmp.find('lookup');
        $A.util.removeClass(inputElement, 'slds-hide');

        // Lookup Div has no selection
        var inputElement = cmp.find('lookup-div');
        $A.util.removeClass(inputElement, 'slds-has-selection');
        
        //this.validateRequireField(cmp);
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
        if (toast)
        {
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

        if (prepId != "")
        {
            
            // Hide the Lookup List
            var lookupList = cmp.find("lookuplist");
            $A.util.addClass(lookupList, 'slds-hide');

            // Hide the Input Element
            var inputElement = cmp.find('lookup');
            $A.util.addClass(inputElement, 'slds-hide');

            // Show the Lookup pill
            var lookupPill = cmp.find("lookup-pill");
            $A.util.removeClass(lookupPill, 'slds-hide');
            $A.util.addClass(lookupPill, 'slds-show');

            // Lookup Div has selection
            var inputElement = cmp.find('lookup-div');
            $A.util.addClass(inputElement, 'slds-has-selection');
        }
        else
        {
            // Hide the Lookup pill
            var lookupPill = cmp.find("lookup-pill");
            $A.util.addClass(lookupPill, 'slds-hide');
            $A.util.removeClass(lookupPill, 'slds-show');

            // Show the Input Element
            var inputElement = cmp.find('lookup');
            $A.util.removeClass(inputElement, 'slds-hide');

            // Lookup Div has no selection
            var inputElement = cmp.find('lookup-div');
            $A.util.removeClass(inputElement, 'slds-has-selection');            
        }
    },
    
    handlePrepare : function(cmp, evt, hlp){
        // Hide the Lookup List
        var lookupList = cmp.find("lookuplist");
        $A.util.addClass(lookupList, 'slds-hide');

        // Hide the Input Element
        var inputElement = cmp.find('lookup');
        $A.util.addClass(inputElement, 'slds-hide');

        // Show the Lookup pill
        var lookupPill = cmp.find("lookup-pill");
        $A.util.removeClass(lookupPill, 'slds-hide');
        $A.util.addClass(lookupPill, 'slds-show');

        // Lookup Div has selection
        var inputElement = cmp.find('lookup-div');
        $A.util.addClass(inputElement, 'slds-has-selection');
    },
    
    handleDisplayDirection: function(comp){
        var lookupDiv = comp.find("lookup-div");
        var lookupDivWidth = lookupDiv.getElement().getBoundingClientRect().left;
        var maxLookupList = 512; //max width
        var lookupList = comp.find("lookuplist");
        
        if(window.innerWidth > maxLookupList && (window.innerWidth < lookupDivWidth + maxLookupList)){
            $A.util.removeClass(lookupList, 'slds-dropdown_left');
            $A.util.addClass(lookupList, 'slds-dropdown_right');
        }else{
            $A.util.removeClass(lookupList, 'slds-dropdown_right');
            $A.util.addClass(lookupList, 'slds-dropdown_left');
        }
    },
    
    toggleErrorMessage: function(component, status, message){
        if(status === true){
            component.set('v.Valid', true);
        }else {
            component.set('v.Valid', false);
            component.set('v.Message', message);
        }
    },

    validateRequireField: function(component){
        // validate required field
        debugger;
        if(!component.get('v.Value') && component.get('v.IsRequired') && component.get('v.panelShow')){
            this.toggleErrorMessage(component, false, $A.get("$Label.c.S360_Field_Required"));
        }else{
            this.toggleErrorMessage(component, true);
            this.validateField(component);
        }
    },

    validateField: function(component){
        // validate field
        var jsonLogicData = {
            "value": component.get('v.Value'),
            "name": component.get('v.CompId'),
			"data": component.get('v.Data')
        }

        if(jsonLogic != undefined && jsonLogic != ''){
            
            //JSLogic Validation
            var validateJson = component.get('v.JsonLogic');
            
            if(validateJson != undefined && validateJson != "") {
                var valid = jsonLogic.apply(validateJson, jsonLogicData);
                
                this.toggleErrorMessage(component, valid, component.get('v.FailureValidationMessage'));
            }   
        }
    }

})