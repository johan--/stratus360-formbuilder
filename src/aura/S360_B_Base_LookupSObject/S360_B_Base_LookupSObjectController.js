({
    scriptsLoaded : function(cmp){
        
    },

    //Prepopulate the values
    doInit : function(cmp){
        if(cmp.get('v.searchString')!=null){
            cmp.set('v.lookup', cmp.get('v.searchString'));
        }
    },
    
    /**
     * Search an SObject for a match
     */
    onblur : function(c,e,h){
        // console.log("BLUR");
    },
    onMatchesUpdate : function(c,e,h){
        if(e.getParam("value") != null)
            c.set('v.showDropdownList', true);
        else
            c.set('v.showDropdownList', false);
        // console.log(document.querySelectorAll('.allLabels'));
        var selectonLen = document.querySelectorAll('.allLabels').length;
        for(var i = 0; i < selectonLen; i++){
            document.querySelectorAll('.allLabels')[i].innerHTML = document.querySelectorAll('.allLabels')[i].innerHTML.toLowerCase().replace(c.get('v.searchString').toLowerCase(), '<b>'+c.get('v.searchString').toLowerCase()+'</b>');
        }
        // document.querySelectorAll('.allLabels').forEach(function(item,index){
        //     item.innerHTML = item.innerHTML.toLowerCase().replace(c.get('v.searchString').toLowerCase(), '<b>'+c.get('v.searchString').toLowerCase()+'</b>');
        // });
    },
	search : function(cmp, event, helper) {
        var moreThan2Chars = cmp.get('v.searchString').match(/\w{2}/);
        if(moreThan2Chars){
		  helper.doSearch(cmp); 
        }
        
        else if (cmp.get('v.searchString')==""){
            cmp.set("v.showDropdownList",false);
        }

        var highlightSerchTerms = function(){
            var labels = document.querySelectorAll('.allLabels');
            var selectionLen = labels.length;
            for(var i = 0; i < selectionLen; i++){
                labels[i].innerHTML = labels[i].innerHTML.toLowerCase().replace(cmp.get('v.searchString').toLowerCase(), '<b>'+cmp.get('v.searchString').toLowerCase()+'</b>');
            }
            // document.querySelectorAll('.allLabels').forEach(function(item,index){
            //     item.innerHTML = item.innerHTML.toLowerCase().replace(this.get('v.searchString').toLowerCase(), '<b>'+this.get('v.searchString').toLowerCase()+'</b>');
            // });
        };
        window.clearTimeout( highlightSerchTerms );

        if(moreThan2Chars){
            window.setTimeout( highlightSerchTerms, 500 );
        }

        //Dispatch an update event with the currently entered search string (to capture user inputted names that are not necessarily in the dropdown)
        var updateEvent = cmp.getEvent("LookupSObjectUpdateEvt");

        // Get the Instance Id of the Component
        var instanceId = cmp.get('v.instanceId');
        var searchString = cmp.get('v.searchString');

        // Populate the event with the selected Object Id and Instance Id
        updateEvent.setParams({
            "searchString" : searchString, 
            "instanceId" : instanceId
        }); 

        // Fire the event
        updateEvent.fire();
    },

    /**
     * Select an SObject from a list
     */
    select : function(cmp, event, helper) {
        helper.handleSelection(cmp, event);
        // var x= document.getElementById("hideclass");
        //cmp.set("v.showDropdownList",false);

    },

    inputTextChanged : function(c,e,h){
        //debugger;
        //helper.handleSelection(cmp,event);
        window.dismissLookupDropdown = function(){
            this.set("v.showDropdownList", false);
        }.bind(c);
        //Hide dropdown if user is not just about to click through to dropdown menu
        window.setTimeout(window.dismissLookupDropdown, 250);

    },
    
    /**
     * Clear the currently selected SObject
     */
    clear : function(cmp, event, helper) {
        helper.clearSelection(cmp);
    },

    handleValueChange : function (cmp, event, helper) {
        helper.valuechange(cmp, event);
    }

})