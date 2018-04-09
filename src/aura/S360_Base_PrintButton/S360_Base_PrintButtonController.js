({
    scriptsLoaded : function(component, event, helper) {
        helper.downloadTemplateHelper(component);
    },
    
    onClick: function(component, event, helper){
        if((/pdf/i).test(component.get('v.PrintType'))){
            helper.printAsPDF(component, event, helper);
        }else if((/docx/i).test(component.get('v.PrintType'))){
         	helper.printAsDocx(component, event, helper);
        }
    },
    
    /* test */
    doInit: function(component, event, helper){
        var scripts = component.get('v.scripts').split(',');
        
        scripts.forEach(function(s, i){
            var script = document.createElement('script');
            script.src = s;
            script.id = 'myscript_' + i;
            Object.preventExtensions(script);
            debugger;
            
            
            /*var observer = new MutationObserver(function(mutations) {
                if(mutations.length > 0){
                    var mutationRecord = mutations[mutations.length-1];
                    var src = mutationRecord.target.getAttribute('data-locker-src');
                    mutationRecord.target.removeAttribute('data-locker-src');
                    mutationRecord.target.src = src;
                    debugger;
                }
            });
            
            observer.observe(script, { attributes : true, attributeFilter : ['data-my'] });*/
            
            //script.innerHTML = helper.test(s);
            try {
                var handler = {
                    get: function(target, name) {
                        return name in target ? target[name] : 42;
                    },
                    getPrototypeOf(target) {
                        return target;
                    }
                };
                    
                var p = new Proxy(script, handler);
                    
                console.log(script);
                debugger;
                document.head.appendChild(Object.getPrototypeOf(p));
            }
            catch(error) {
              console.error(error);
            }
            
            
        });
    },
    
    afterRender: function(component, event, helper){
        return;
        if(!component.get('v.isRendered')){
            component.set('v.isRendered', true);
            
            var scriptCount = 0;
        	var scripts = component.get('v.scripts').split(',');
            
            scripts.forEach(function(s, i){
                var script = document.getElementById('myscript_' + i);
                console.log(script);
                debugger;
                return;
                script.onload = function() {
                  alert("Script loaded and ready");
                };
                script.src = script.getAttribute('data-locker-src') + '';
                script.setAttribute('data-my', 'a')
                debugger;
            });
            
        }
        
    },
})