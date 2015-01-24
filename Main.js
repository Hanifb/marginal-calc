"use strict";

var marginalCalc = {
    modules: [],
    moduleCache : [],
     addModule: function(moduleName,obj){
         this.modules[moduleName] = obj;
    },
    run : function(fn){
        console.log("Run");
        this.execModule("$Main",fn)
        this.moduleCache["$Main"].ready();
    },

    execModule : function(moduleName, func){

        if(typeof this.moduleCache[moduleName] !== "undefined"){
            return this.moduleCache[moduleName];
        }



        console.log("execModule", moduleName);
        console.log("execModule2", func);
        var obj = new func;
        var dependencies = this.resolveDependencies(func);
        func.apply(obj, dependencies);
        return this.moduleCache[moduleName] = obj;

    },


    resolveDependencies : function(func) {
        var args = this.getArguments(func);
        var dependencies = [];
        for ( var i = 0; i < args.length; i++) {
            console.log("Looping argument", args[i] );
            if(args[i].length){
                dependencies.push(this.execModule(args[i], this.modules[args[i]]));
            }

        }
        return dependencies;
    },
    getArguments : function(func) {
        console.log("Getting Arguments for", func);
        //This regex is from require.js
        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        var args = func.toString().match(FN_ARGS)[1].split(',');
        args = args.map(function(arg){
                return arg.trim();
        });
        return args;
    }
};