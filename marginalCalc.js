"use strict";

/**
 * The Main Calculator Object
 * @type {Object}
 */
var marginalCalc = {
    loaded: false,
    modules: [],
    modulePriority: [],
    moduleCache: [],
    /**
     * Adds Module
     * @param moduleName name of the Module, referenced function parameters
     * @param obj The module function
     * @param priority Defines in what order the priority the module shall be calculated.
     * @returns {marginalCalc} returns the Calculator itself for chaining.
     */
    addModule: function (moduleName, obj, priority) {

        this.modules[moduleName] = obj;
        var tempObj = new obj;

        if (tempObj.hasOwnProperty("totalCalc")) {
            this.modulePriority.push({'priority': priority ? priority : 100, 'moduleName': moduleName});
        }

        return this;
    },
    /**
     * The main function runner. Saves the function for later use by the waitForLoad function.
     * @param fn
     */
    run: function (fn) {
        this.modules["$Main"] = fn;

        this.waitForLoad();
    },
    /**
     * Waits for nod from scriptloader.
     */
    waitForLoad: function () {
        var that = this;
        if (this.scriptLoader.complete === true) {

            this.runMain(this.modules["$Main"]);
            return;
        }
        console.log("skipping");
        this.timeout = setTimeout(function () {
            that.waitForLoad()
        }, 1000);
    },
    /**
     * Runs the main function, may be used to skip the nod from {Scriptloader}.
     * @param fn
     * */
    runMain: function (fn) {
        this.execModule("$Main", fn);
        this.moduleCache["$Main"].ready();
    },
    /**
     * Initiates the function, injects the arguments defined fromm the list of loaded modules
     * it also saves the initiated function.
     * @param moduleName Name of the module its loading
     * @param func function body of the module
     * @returns {Module} returns the Module
     */
    execModule: function (moduleName, func) {

        if (typeof this.moduleCache[moduleName] !== "undefined") {
            return this.moduleCache[moduleName];
        }

        var obj = new func;
        var dependencies = this.resolveDependencies(func);
        func.apply(obj, dependencies);
        return this.moduleCache[moduleName] = obj;

    },
    /**
     * Finds and loads the dependecies of the function
     * @param func Function to find the dependecies of
     * @returns {Array} of modules
     */
    resolveDependencies: function (func) {
        var args = this.getArguments(func);
        var dependencies = [];
        for (var i = 0; i < args.length; i++) {
            if (args[i].length) {
                if (typeof this.modules[args[i]] === "undefined") {
                    throw new Error("Module (" + args[i] + ") is not registered, requested by module");
                }
                dependencies.push(this.execModule(args[i], this.modules[args[i]]));
            }

        }
        return dependencies;
    },
    /**
     * Extracts the arguments from a function
     * @param func
     * @returns {Array} of arguments
     */
    getArguments: function (func) {
        //This regex is from require.js
        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        var args = func.toString().match(FN_ARGS)[1].split(',');
        args = args.map(function (arg) {
            return arg.trim();
        });
        return args;
    },
    /**
     * Runs totalCalc function on every module based on its priority. Sums the result.
     * @returns {number} Total sum of modules.
     */
    totalCalc: function () {

        var totalCalcModules = this.modulePriority.sort(function (a, b) {
            return a.priority - b.priority
        });

        var totalSum = 0;
        for (var i = 0; i < totalCalcModules.length; i++) {
            var moduleName = totalCalcModules[i].moduleName;
            var module = this.execModule(moduleName, this.modules[moduleName]);
            totalSum += module.totalCalc(totalSum);
        }
        return totalSum;

    },

    config: {
        url: "",
        moduleFolder: "modules/"
    },
    /**
     * Loads the scripts
     */
    scriptLoader: {
        complete: true,
        promisedModules: [],
        loaded: [],
        /**
         * Called by the loaded Script to give nod to the calculator that it may run and create the modules.
         * @param module
         */
        loadComplete: function (module) {
            this.loaded.push(module);
            if (this.promisedModules.length === this.loaded.length) {
                this.complete = true;
            }
        },
        /**
         * Creates <script> in header for loading of modules
         * @param {Array} An array of filenames to load from the modules folder
         */
        addScripts: function (modules) {
            this.promisedModules = modules;
            this.complete = false;
            var that = this;
            for (var i = 0; i < modules.length; i++) {
                var module = modules[i];
                var fileref = document.createElement('script');
                fileref.type = "text/javascript";
                fileref.src = marginalCalc.config.url + marginalCalc.config.moduleFolder + module + ".js";
                fileref.async = true;
                document.getElementsByTagName("head")[0].appendChild(fileref);
            }

        }


    }
};