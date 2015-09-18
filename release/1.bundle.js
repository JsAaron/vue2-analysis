webpackJsonp([1],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(6)

	Vue.transition('expand', {

	    beforeEnter: function(el) {
	        console.log('beforeEnter')
	        // el.textContent = 'beforeEnter'
	    },
	    enter: function(el) {
	         console.log('enter')
	        // el.textContent = 'enter'
	    },
	    afterEnter: function(el) {
	         console.log('afterEnter')
	        // el.textContent = 'afterEnter'
	    },
	    enterCancelled: function(el) {
	         console.log('enterCancelled')
	        // handle cancellation
	    },

	    beforeLeave: function(el) {
	        console.log(222)
	        // el.textContent = 'beforeLeave'
	    },
	    leave: function(el) {
	        // el.textContent = 'leave'
	    },
	    afterLeave: function(el) {
	        // el.textContent = 'afterLeave'
	    },
	    leaveCancelled: function(el) {
	        // handle cancellation
	    }
	})



	module.exports = {
	    template: __webpack_require__(8),
	    replace: true,
	    data: function() {
	        return {
	            msg: 'This is page A.',
	            leftName: 'Bruce Lee',
	            rightName: 'Chuck Norris'
	        }
	    },
	    compiled: function() {
	        this.$emit('data-loaded')
	    },
	    components: {
	        'app-header': __webpack_require__(9),
	        'app-pane': __webpack_require__(13)
	    }
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(7);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/stylus-loader/index.js!./a.styl", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/stylus-loader/index.js!./a.styl");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".view {\n  transition: all 0.4s ease;\n  position: absolute;\n}\n.view.expand-enter {\n  opacity: 0;\n  -webkit-transform: translate3d(100px, 0, 0);\n  transform: translate3d(100px, 0, 0);\n}\n.view.v-leave {\n  opacity: 0;\n  -webkit-transform: translate3d(-100px, 0, 0);\n  transform: translate3d(-100px, 0, 0);\n}\n", ""]);

	// exports


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = "<div class=\"view\" v-transition=\"expand\">\r\n    <app-header msg=\"{{msg}}\"></app-header>\r\n    <app-pane side=\"left\" name=\"{{leftName}}\"></app-pane>\r\n    <app-pane side=\"right\" name=\"{{rightName}}\"></app-pane>\r\n</div>\r\n";

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(10)

	module.exports = {
	  template: __webpack_require__(12),
	  props: ['msg']
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(11);
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "app-header {\n  color: #bada55;\n}\n", ""]);

	// exports


/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = "<h1>{{msg}}</h1>";

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(14)

	module.exports = {
	  template: __webpack_require__(16),
	  replace: true,
	  props: ['side', 'name']
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(15);
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".pane {\n  display: inline-block;\n  width: 300px;\n  height: 300px;\n  box-sizing: border-box;\n  padding: 15px 30px;\n  border: 2px solid #f3f3f3;\n  margin: 10px;\n}\n", ""]);

	// exports


/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = "<div class=\"pane\">\r\n  <p>This is the {{side}} pane!</p>\r\n  <p>{{name}}</p>\r\n</div>";

/***/ }
]);