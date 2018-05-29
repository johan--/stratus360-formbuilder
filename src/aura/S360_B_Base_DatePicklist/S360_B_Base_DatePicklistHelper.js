({
    onChange : function(component, event, helper){
        //update values
        // //debugger;
        // component.set('v.DefaultDay', component.find('InputDay').get('v.value'));
        // component.set('v.DefaultMonth', component.find('InputMonth').get('v.value'));
        // component.set('v.DefaultYear', component.find('InputYear').get('v.value'));


        var evt = component.getEvent('OnChange');
        var day = component.get('v.IsDayPresent')
        ? component.find('InputDay').get('v.value') + '-'
        : '';
        var dateWithFormat = component.find('InputYear').get('v.value')+'-'+ day + component.find('InputMonth').get('v.value');
        evt.setParams({
            "CompId": component.get('v.CompId'),
            "payload": dateWithFormat
        });
        component.set("v.DateString", dateWithFormat);

        evt.fire();

        // //Reevaluate day options (I'm sure there's a smarter way to do this)
        // var dayOpts = helper.setDayOpts(component.find('InputMonth').get('v.value'), component.find('InputYear').get('v.value'), component.find('InputDay').get('v.value'));
        // if(component.get("v.IsDayPresent")) {
        //     component.find("InputDay").set("v.options", dayOpts);
        // }
    },

    setDayOpts : function(month, year, defaultDay) {
        //Set day options based on month (number of days in that month)
        var thirtyOneDays = ["January", "March", "May", "July", "August", "October", "December"];
        var thirtyDays = ["April", "June", "September", "November"];
        var nDays;
        var dayOpts = [];

        if(month[0] == ";") {
            month = month.substring(1);
        }
        //Get number of days in month
        if(String(month) == "February"){
            nDays = (year % 4 == 0) ? 29 : 28;
        }
        if(thirtyOneDays.indexOf(String(month)) > -1){
            nDays = 31;
        }
        if(thirtyDays.indexOf(String(month)) > -1){
            nDays = 30;
        }
        if(month == ""){
            nDays = 0;
            if(!defaultDay){
                dayOpts.push({
                    "class": "optionClass",
                    "label": String(defaultDay),
                    "value": String(defaultDay)
                });
            }
        }
        else if(typeof nDays == "undefined"){
            //Month is a number but is outside the valid range
            //alert("Month value " + month + " is invalid (in Base_DatePicklist");
        }

        //Set default NaN value
        // if(Number.isNaN(defaultDay)) dayOpts.push({class:'optionClass', label: "DD", value:NaN});

        for(var i = 1; i <= nDays; i++){
            var row = {
                "class": "optionClass",
                "label": String(i),
                "value": String(i)
            };
            if(i == defaultDay) row.selected = "true";
            dayOpts.push(row);
        }
        dayOpts.unshift({
            "class": "optionClass",
            "label": "",
            "value": "",
            "selected": (typeof defaultDay == "undefined")
        });

        return dayOpts;
    },

    // setYearOpts : function(component, evt, helper){
    //     //this funciton is called if no default year options were provided
    //     var currentYear = new Date().getFullYear();
    //     var minY = currentYear - 100;
    //     var maxY = currentYear + 10;
    //     var yearOpts = [];    var defaultY = component.get('v.DefaultYear');

    //     if(defaultY == "YY") yearOpts.push({ class:"optionClass", label="YY", value="", selected:true});

    //     for(var i = minY; i < maxY; i++){
    //         yearOpts.push({
    //             class:"optionClass",
    //             label: String(i),
    //             value: String(i),
    //             selected: (String(i) == String(defaultY))
    //         });
    //     }


    // }
})