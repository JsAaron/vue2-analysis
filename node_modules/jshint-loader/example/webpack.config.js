var path = require("path");
module.exports = {
	entry: "./entry.js",
	output: {
		path: path.join(__dirname, "out"),
		filename: "bundle.js"
	},
	module: {
		preLoaders: [
			{ test: /\.js$/, loader: path.join(__dirname, "..") }
		]
	},
	jshint: {
		camelcase: true
	}
};