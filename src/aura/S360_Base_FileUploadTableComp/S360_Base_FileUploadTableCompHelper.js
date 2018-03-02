({
	findParent : function(hlp, p, parentClassName){
        if(p.classList.contains(parentClassName)){
            return p;
        }else{
            return hlp.findParent(hlp, p.parentElement, parentClassName);
        }
    },
    
    manageTableHeightDimention : function(comp){
        
        /*var x = document.getElementById(comp.get('v.CompId'));
        var preferedSize = window.innerHeight - x.offsetTop;
        comp.set('v.tableHeight', (preferedSize - 50 - 32));*/
        var x = document.getElementById(comp.get('v.CompId'));
        var pos = x.getBoundingClientRect();
        var preferedSize = window.innerHeight - pos.top;
        
        /*50 is pagination height*/
        /*12 is margin bottom*/
        /*32 is table header row height*/
        /*39 is table body row height*/
        
        var minHeight = (3 * 39) + 32 - 12; // min show 3 row;
        if((preferedSize - 50 - 12) > minHeight){
            minHeight = preferedSize - 50 - 12;
        }
        
        comp.set('v.tableHeight', minHeight);
    },
    
    manageTableWidthDimention : function(comp){
        //manage width
        //console.log(comp.get('v.tableWidth')+"-"+window.innerWidth);
        if(comp.get('v.tableWidth') < window.innerWidth){
            var oldColumnWidth = comp.get('v.columnWidth');
            var difference = window.innerWidth - comp.get('v.tableWidth');
            var additionalWidth = difference / (oldColumnWidth.length - 2); //-2 because ignore 2 first column (fixed width)
            var newColumnWidth = [];
            
            newColumnWidth.push(oldColumnWidth[0]);
            newColumnWidth.push(oldColumnWidth[1]);
            for(var i = 2; i < oldColumnWidth.length; i++){
                newColumnWidth.push(oldColumnWidth[i] + additionalWidth);
            }
            
            comp.set('v.columnWidth', newColumnWidth);
            comp.set('v.tableWidth', window.innerWidth);
            comp.set('v.initTableWidth', window.innerWidth);
        }
    },
    
    setTableHeadWidth : function(comp){
        var tableBodyContainerWidth = comp.find('table-body-container').getElement().offsetWidth;
        var tableBodyWidth = comp.find('table-body').getElement().offsetWidth;
        
        console.log('table : ' + tableBodyWidth + 'container : ' + tableBodyContainerWidth);
        
        comp.find('table-head-container').getElement().style.width = tableBodyContainerWidth - 17 + "px";
    }
})