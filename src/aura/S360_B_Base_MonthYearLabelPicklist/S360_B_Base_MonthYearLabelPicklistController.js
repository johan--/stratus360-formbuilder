({
    doInit : function(cmp, event, helper) {

        //Default numbers could be NaN
        var defaultDay = cmp.get('v.DefaultDay') ? (cmp.get("v.IsDisabled") ? "" : cmp.get('v.DefaultDay')) : "";
        // var defaultMonth = cmp.get('v.DefaultMonth');
        var defaultMonth = cmp.get('v.DefaultMonth') ? (cmp.get("v.IsDisabled") ? "" : cmp.get('v.DefaultMonth')) : "";
        var defaultYear = cmp.get('v.DefaultYear') ? (cmp.get("v.IsDisabled") ? "" : cmp.get('v.DefaultYear')) : "";

        var dayOpts = []; 
        var monthOpts = [];

        monthOpts = [
            { class: "optionClass", label: "January", value: "January", selected:(String(defaultMonth)=="January")},
            { class: "optionClass", label: "February", value: "February", selected:(String(defaultMonth)=="February") },
            { class: "optionClass", label: "March", value: "March", selected:(String(defaultMonth)=="March") },
            { class: "optionClass", label: "April", value: "April",selected:(String(defaultMonth)=="April") },
            { class: "optionClass", label: "May", value: "May", selected:(String(defaultMonth)=="May") },
            { class: "optionClass", label: "June", value: "June", selected:(String(defaultMonth)=="June")},
            { class: "optionClass", label: "July", value: "July", selected:(String(defaultMonth)=="July")},
            { class: "optionClass", label: "August", value: "August", selected:(String(defaultMonth)=="August") },
            { class: "optionClass", label: "September", value: "September", selected:(String(defaultMonth)=="September") },
            { class: "optionClass", label: "October", value: "October", selected:(String(defaultMonth)=="October") },
            { class: "optionClass", label: "November", value: "November", selected:(String(defaultMonth)=="November") },
            { class: "optionClass", label: "December", value: "December", selected:(String(defaultMonth)=="December") }];

        //Disable day input if month isn't selected (it needs month to be set to display options)
        //Then set selected month to default value
        if(defaultMonth == "") {
            cmp.set('v.DayDisabled');
        }
        monthOpts.unshift({ class: "optionClass", label: "", value: "", selected:String(defaultMonth=="")});

        dayOpts = helper.setDayOpts(defaultMonth, new Date().getFullYear(), defaultDay);

        // var yearOpts = cmp.get("v.picklistYear") || [
        //     { class: "optionClass", label: "2010", value: "2010", selected: String(defaultYear) == "2010"},
        //     { class: "optionClass", label: "2011", value: "2011", selected: String(defaultYear) == "2011"},
        //     { class: "optionClass", label: "2012", value: "2012", selected: String(defaultYear) == "2012"},
        //     { class: "optionClass", label: "2013", value: "2013", selected: String(defaultYear) == "2013"},
        //     { class: "optionClass", label: "2014", value: "2014", selected: String(defaultYear) == "2014"},
        //     { class: "optionClass", label: "2015", value: "2015", selected: String(defaultYear) == "2015" },
        //     { class: "optionClass", label: "2016", value: "2016", selected: String(defaultYear) == "2016" },
        //     { class: "optionClass", label: "2017", value: "2017", selected: String(defaultYear) == "2017" }];

        if(cmp.get("v.PicklistYear") && cmp.get("v.PicklistYear").length){
            var rawOpts = cmp.get("v.PicklistYear").split(',');
            var yearOpts = [];
            for(var i = 0; i < rawOpts.length; i++){
                yearOpts.push({
                    class: "optionClass",
                    label: String(rawOpts[i]).match(/(\d*)|/)[0],
                    value: String(rawOpts[i]).match(/(\d*)|/)[0],
                    selected: String(defaultYear) == String(rawOpts[i]).match(/(\d*)|/)[0]
                })  
            }
            yearOpts.unshift({class: "optionClass", label:"", value:"", selected:defaultYear == ""})
        }
        else{
            var yearOpts = [
            { class: "optionClass", label: "2010", value: "2010", selected: String(defaultYear) == "2010"},
            { class: "optionClass", label: "2011", value: "2011", selected: String(defaultYear) == "2011"},
            { class: "optionClass", label: "2012", value: "2012", selected: String(defaultYear) == "2012"},
            { class: "optionClass", label: "2013", value: "2013", selected: String(defaultYear) == "2013"},
            { class: "optionClass", label: "2014", value: "2014", selected: String(defaultYear) == "2014"},
            { class: "optionClass", label: "2015", value: "2015", selected: String(defaultYear) == "2015"},
            { class: "optionClass", label: "2016", value: "2016", selected: String(defaultYear) == "2016"},
            { class: "optionClass", label: "2017", value: "2017", selected: String(defaultYear) == "2017"}];
        }
    
        
        cmp.find("InputMonth").set("v.options", monthOpts);


        if(cmp.get("v.IsDayPresent")) {
            cmp.find("InputDay").set("v.options", dayOpts);
        }

        cmp.find("InputYear").set("v.options", yearOpts);
    },
    

    // onSelectChange: function(component, event, helper){
        
    //     helper.onChange(component, event, helper);
        
    // },

    changeDay: function(cmp,evt,hlp){
        cmp.set('v.DefaultDay', cmp.find('InputDay').get('v.value'));
        hlp.onChange(cmp, evt, hlp);
    },
    changeMonth: function(cmp,evt,hlp){

        cmp.set('v.DefaultMonth', cmp.find('InputMonth').get('v.value'));
        //Reevaluate day options (I'm sure there's a smarter way to do this)
        var dayOpts = hlp.setDayOpts(cmp.find('InputMonth').get('v.value'), cmp.find('InputYear').get('v.value'), cmp.find('InputDay').get('v.value'));
        if(cmp.get("v.IsDayPresent")) {
            cmp.find("InputDay").set("v.options", dayOpts);
        }
        hlp.onChange(cmp, evt, hlp);
    },
    changeYear: function(cmp,evt,hlp){
        cmp.set('v.DefaultYear', cmp.find('InputYear').get('v.value'));
        //Reevaluate day options (I'm sure there's a smarter way to do this)
        var dayOpts = hlp.setDayOpts(cmp.find('InputMonth').get('v.value'), cmp.find('InputYear').get('v.value'), cmp.find('InputDay').get('v.value'));
        if(cmp.get("v.IsDayPresent")) {
            cmp.find("InputDay").set("v.options", dayOpts);
        }
        hlp.onChange(cmp, evt, hlp);
    },
    disabledChange: function(cmp,evt,hlp){
        
        if(cmp.get('v.IsDisabled')) {
            cmp.set('v.DefaultDay', '');
            cmp.set('v.DefaultMonth', '');
            cmp.set('v.DefaultYear', '');
        }
    }
    // onSelectChangeYear: function(component, event, helper){
    //     helper.onChange(component);
    // }
})