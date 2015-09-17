webpackJsonp([1],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = {
	    template: __webpack_require__(6),
	    replace: true,
	    data: function() {
	        return {
	            msg       : 'This is page A.',
	            leftName  : 'Bruce Lee',
	            rightName : 'Chuck Norris'
	        }
	    },
	    compiled: function() {
	        var self = this;
	        setTimeout(function() {
	            self.$emit('data-loaded')
	        }, 500)
	    },
	    components: {
	        'app-header': __webpack_require__(7),
	        'app-pane': __webpack_require__(11)
	    }
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = "<div class=\"view\" v-transition>\r\n    <app-header msg=\"{{msg}}\"></app-header>\r\n    <app-pane side=\"left\" name=\"{{leftName}}\"></app-pane>\r\n    <app-pane side=\"right\" name=\"{{rightName}}\"></app-pane>\r\n</div>\r\n";

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(8)

	module.exports = {
	  template: __webpack_require__(10),
	  props: ['msg']
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(9);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/stylus-loader/index.js!./style.styl", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/stylus-loader/index.js!./style.styl");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "app-header {\n  color: #bada55;\n}\n", ""]);

	// exports


/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = "<h1>{{msg}}</h1>";

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(12)

	module.exports = {
	  template: __webpack_require__(14),
	  replace: true,
	  props: ['side', 'name']
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(13);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/stylus-loader/index.js!./style.styl", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/stylus-loader/index.js!./style.styl");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".pane {\n  display: inline-block;\n  width: 300px;\n  height: 300px;\n  box-sizing: border-box;\n  padding: 15px 30px;\n  border: 2px solid #f3f3f3;\n  margin: 10px;\n}\n", ""]);

	// exports


/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = "<div class=\"pane\">\r\n  <p>This is the {{side}} pane!</p>\r\n  <p>{{name}}</p>\r\n</div>";

/***/ }
]);