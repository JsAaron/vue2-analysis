/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var jshint = require("jshint").JSHINT;
var RcLoader = require("rcloader");
var stripJsonComments = require("strip-json-comments");
var loaderUtils = require("loader-utils");
var fs = require("fs");


// setup RcLoader
var rcLoader = new RcLoader(".jshintrc", null, {
	loader: function(path) {
		return path;
	}
});

function loadRcConfig(callback){
	var sync = typeof callback !== "function";

	if(sync){
		var path = rcLoader.for(this.resourcePath);
		if(typeof path !== "string") {
			// no .jshintrc found
			return {};
		} else {
			this.addDependency(path);
			var file = fs.readFileSync(path, "utf8");
			return JSON.parse(stripJsonComments(file));
		}
	}
	else {
		rcLoader.for(this.resourcePath, function(err, path) {
			if(typeof path !== "string") {
				// no .jshintrc found
				return callback(null, {});
			}

			this.addDependency(path);
			fs.readFile(path, "utf8", function(err, file) {
				var options;

				if(!err) {
					try {
						options = JSON.parse(stripJsonComments(file));
					}
					catch(e) {
						err = e;
					}
				}
				callback(err, options);
			});
		}.bind(this));
	}
}

function jsHint(input, options) {
	// copy options to own object
	if(this.options.jshint) {
		for(var name in this.options.jshint) {
			options[name] = this.options.jshint[name];
		}
	}

	// copy query into options
	var query = loaderUtils.parseQuery(this.query);
	for(var name in query) {
		options[name] = query[name];
	}


	// copy globals from options
	var globals = {};
	if(options.globals) {
		if(Array.isArray(options.globals)) {
			options.globals.forEach(function(g) {
				globals[g] = true;
			}, this);
		} else {
			for(var g in options.globals)
				globals[g] = options.globals[g];
		}
		delete options.globals;
	}

	// move flags
	var emitErrors = options.emitErrors;
	delete options.emitErrors;
	var failOnHint = options.failOnHint;
	delete options.failOnHint;

	// custom reporter
	var reporter = options.reporter;
	delete options.reporter;

	// module system globals
	globals.require = true;
	globals.module = true;
	globals.exports = true;
	globals.global = true;
	globals.process = true;
	globals.define = true;

	var source = input.split(/\r\n?|\n/g);
	var result = jshint(source, options, globals);
	var errors = jshint.errors;
	if(!result) {
		if(reporter) {
			reporter.call(this, errors);
		} else {
			var hints = [];
			if(errors) errors.forEach(function(error) {
				if(!error) return;
				var message = "  " + error.reason + " @ line " + error.line + " char " + error.character + "\n    " + error.evidence;
				hints.push(message);
			}, this);
			var message = hints.join("\n\n");
			var emitter = emitErrors ? this.emitError : this.emitWarning;
			if(emitter)
				emitter("jshint results in errors\n" + message);
			else
				throw new Error("Your module system doesn't support emitWarning. Update availible? \n" + message);
		}
	}
	if(failOnHint && !result)
		throw new Error("Module failed in cause of jshint error.");
}

module.exports = function(input, map) {
	this.cacheable && this.cacheable();
	var callback = this.async();

	if(!callback) {
		// load .jshintrc synchronously
		var config = loadRcConfig.call(this);
		jsHint.call(this, input, config);
		return input;
	}

	// load .jshintrc asynchronously
	loadRcConfig.call(this, function(err, config) {
		if(err) return callback(err);

		try {
			jsHint.call(this, input, config);
		}
		catch(e) {
			return callback(e);
		}
		callback(null, input, map);

	}.bind(this));
}
