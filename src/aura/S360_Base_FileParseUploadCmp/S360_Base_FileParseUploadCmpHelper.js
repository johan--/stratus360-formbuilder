({
	MAX_FILE_SIZE: 4500000, /* 6 000 000 * 3/4 to account for base64 */
    CHUNK_SIZE: 900000, /* Use a multiple of 4 */
    save : function(component) {
        var fileInput = component.find("fileSelected").getElement();
        var file = fileInput.files[0];
        
        // only csv file type allowed
        var fileArr = file.name.split('.');
        console.log(file.name);
        if(fileArr[fileArr.length-1].toLowerCase().search("csv") < 0){
            this.response(
                        component, 
                        false,
                        ['Incorrect file type'],
                        [],
                        ''
                    );
            return;
        }
   
        if (file.size > this.MAX_FILE_SIZE) {
            this.response(
                        component, 
                        false,
                        ['File size cannot exceed ' + this.MAX_FILE_SIZE + ' bytes.\n' +'Selected file size: ' + file.size],
                        [],
                        ''
                    );
            return;
        }
        
        var fr = new FileReader();

        var self = this;
        fr.onloadend = function() {
            var fileContents = '';
            var bytes = new Uint8Array(fr.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
                fileContents += String.fromCharCode(bytes[i]);
            }
            
            var lineDatas = self.CSVToArray(fileContents, ',');
            var columnNames = lineDatas[0];
            
            var sobject = [];
            
            try{
            	for(var i = 1; i < lineDatas.length; i++){
                var o = {};
                if(lineDatas[i]!='')
                {
                    lineDatas[i].forEach(function(d, index){
                        o[columnNames[index]] = d;
                    });
                    
                    if(Object.keys(o).length > 0){
                    	o.sobjectType = component.get('v.SobjectType');
                    	o[component.get('v.ParentFieldName')] = component.get('v.ParentId');
                        sobject.push(o);
                    }
                }
            }    
            }catch(x){
                console.log('exception');
                console.log(x);
            }
            
            
            component.set('v.SObject', sobject);
            
            self.upload(component, columnNames);
        };

        //fr.readAsBinaryString(file);
        fr.readAsArrayBuffer(file);
    },
    
    getLine : function(data){
       //return data.split('\n'); 
        var lines = data.split(/\r|\n/).filter(function(d){
            return d != '';
        });
        return lines;
    },
    
    getDataFromLine : function(line){
        var isEmpty = true;
        var data = line.split(',').map(function(col){
            if(col != ''){
                isEmpty = false;
            }
            return col.trim();
        });
        if(data[data.length-1] == ''){
        	data.pop();    
        }
        
        if(isEmpty){
            return [];
        }
        
        return data;
    },
    
    upload : function(component, column){
        var self = this;
        var action = component.get('c.saveRecords');
        action.setParams({
            soBjectType: component.get('v.SobjectType'),
            fieldPopulated: column,
            records: component.get('v.SObject')
        });
        //debugger;
        console.log(action.getParams());
        action.setCallback(this, function(r){
            if(r.getState() == "SUCCESS"){
                console.log(r.getReturnValue());
                if(r.getReturnValue().status){
                    self.response(
                        component, 
                        true,
                        [],
                        [],
                        ''
                    );
                    
                    self.clearInputFile(component);
                }else{
                 	self.response(
                        component, 
                        false,
                        [],
                        r.getReturnValue().messages,
                        r.getReturnValue().data
                    );   
                }
            }else if(r.getState() == 'ERROR'){
                var errorMessage = ['Csv file contains error'];
                var error = r.getError();
                if(error){
                    
                    self.response(
                        component, 
                        false,
                        errorMessage,
                        [],
                        ''
                    );
                }else{
                    self.response(
                        component, 
                        false,
                        //['Unknown error!'],
                        errorMessage,
                        [],
                        ''
                    );
                }
            }
        });
        window.setTimeout(
            $A.getCallback(function() {
                $A.enqueueAction(action); 
            }),1000
        );
    },
    
    response : function(comp, status, clientMessage, serverMessage, data){
        var evt = comp.getEvent('OnChange');
        evt.setParams({
            'CompId' : comp.get('v.CompId'),
            'Payload' : {
                'status' : status,
                'messages' : {
                    'client' : clientMessage,
                    'server' : serverMessage
                },
                'data' : data
            }
        });
        
        evt.fire();
    },
    
    clearInputFile : function(comp){
        comp.find("fileSelected").getElement().value='';
    },
    
    // ref: http://stackoverflow.com/a/1293163/2343
    // This will parse a delimited string into an array of
    // arrays. The default delimiter is the comma, but this
    // can be overriden in the second argument.
    CSVToArray : function( strData, strDelimiter ){
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
            );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
                ){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );

            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                    );

            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        // Return the parsed data.
        return( arrData );
    }
})