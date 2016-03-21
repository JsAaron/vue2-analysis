/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Ue = __webpack_require__(1);
	
	var _Ue2 = _interopRequireDefault(_Ue);
	
	var _globalApi = __webpack_require__(8);
	
	var _globalApi2 = _interopRequireDefault(_globalApi);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	//ul构造器
	
	
	(0, _globalApi2.default)(_Ue2.default);
	//实例扩展的一些api接口
	
	
	_Ue2.default.version = 'undefined';
	
	exports.default = _Ue2.default;
	
	
	window.Ue = _Ue2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _index = __webpack_require__(2);
	
	/**
	 * Ue构造器
	 * @param {[type]} options [description]
	 */
	function Ue(options) {
	    this._init(options);
	}
	
	Ue.prototype._init = function (options) {
	    options = options || {};
	    this.$el = null;
	
	    //合并options参数
	    options = this.$options = (0, _index.mergeOptions)(this.constructor.options, options, this);
	
	    //初始化空数据
	    //通过_initScope方法填充
	    this._data = {};
	
	    this._initState();
	};
	
	Object.defineProperty(Ue.prototype, '$data', {
	    get: function get() {
	        return this._data;
	    },
	    set: function set(newData) {
	        if (newData !== this._data) {
	            this._setData(newData);
	        }
	    }
	});
	
	/**
	 * 构建实例的作用域
	 * 包含
	 * 观察 data
	 * @return {[type]} [description]
	 */
	Ue.prototype._initState = function () {
	    this._initProps();
	};
	
	/**
	 * 初始化props属性
	 * @return {[type]} [description]
	 */
	Ue.prototype._initProps = function () {
	    var options = this.$options;
	    var el = options.el;
	    var props = options.props;
	    if (props && !el) {
	        (0, _index.warn)('在实例化的时候,如果没有el,props不会被变异');
	    }
	};
	
	exports.default = Ue;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _lang = __webpack_require__(3);
	
	Object.keys(_lang).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _lang[key];
	    }
	  });
	});
	
	var _debug = __webpack_require__(4);
	
	Object.keys(_debug).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _debug[key];
	    }
	  });
	});
	
	var _dom = __webpack_require__(5);
	
	Object.keys(_dom).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _dom[key];
	    }
	  });
	});
	
	var _options = __webpack_require__(6);
	
	Object.keys(_options).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _options[key];
	    }
	  });
	});

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.hasOwn = hasOwn;
	exports._toString = _toString;
	exports.extend = extend;
	
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	
	/**
	 * 检查对象上是否有指定的属性
	 * @param {Object} obj
	 * @param {String} key
	 * @return {Boolean}
	 */
	function hasOwn(obj, key) {
	    return hasOwnProperty.call(obj, key);
	}
	
	function _toString(value) {
	    return value == null ? '' : value.toString();
	}
	
	/**
	 * 混入属性合并
	 * @param  {[type]} to   [description]
	 * @param  {[type]} from [description]
	 * @return {[type]}      [description]
	 */
	function extend(to, from) {
	    var keys = Object.keys(from);
	    var i = keys.length;
	    while (i--) {
	        to[keys[i]] = from[keys[i]];
	    }
	    return to;
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * 错误提示
	 */
	var warn = void 0;
	var hasConsole = typeof console !== 'undefined';
	exports.warn = warn = function warn(msg, e) {
	    if (hasConsole) {
	        console.warn('[Ue warn]: ' + msg);
	    }
	};
	exports.warn = warn;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.query = query;
	/**
	 * 查询节点
	 * @param  {[type]} el [description]
	 * @return {[type]}    [description]
	 */
	function query(el) {
	    if (typeof el === 'string') {
	        var selector = el;
	        el = document.querySelector(el);
	        if (!el) {
	            warn('Cannot find element: ' + selector);
	        }
	    }
	    return el;
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.mergeOptions = mergeOptions;
	
	var _config = __webpack_require__(7);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _lang = __webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var strats = _config2.default.optionMergeStrategies = Object.create(null);
	
	/**
	 * 当存在一个vm(实例创建), 我们需要做的 
	 * 构造函数之间的三方合并选项, 实例
	 * @param  {[type]} parentVal [description]
	 * @param  {[type]} childVal  [description]
	 * @return {[type]}           [description]
	 */
	function mergeAssets(parentVal, childVal) {
	    var res = Object.create(parentVal);
	    return childVal ? (0, _lang.extend)(res, guardArrayAssets(childVal)) : res;
	}
	_config2.default._assetTypes.forEach(function (type) {
	    strats[type + 's'] = mergeAssets;
	});
	
	strats.data = function () {};
	
	strats.el = function () {};
	
	strats.props = strats.methods = strats.computed = function (parentVal, childVal) {
	    if (!childVal) return parentVal;
	    if (!parentVal) return childVal;
	    var ret = Object.create(null);
	    (0, _lang.extend)(ret, parentVal);
	    (0, _lang.extend)(ret, childVal);
	    return ret;
	};
	
	function guardArrayAssets(assets) {
	    console.log(assets);
	}
	
	/**
	 * 默认策略
	 */
	var defaultStrat = function defaultStrat(parentVal, childVal) {
	    return childVal === undefined ? parentVal : childVal;
	};
	
	/**
	 * 合并
	 * 将两个选项对象合并为一个新的
	 * @return {[type]} [description]
	 */
	function mergeOptions(parent, child, vm) {
	
	    var options = {};
	    var key;
	
	    //optons:
	    // components: Object
	    // directives: Object
	    // elementDirectives: Object
	    // filters: Object
	    // partials: Object
	    // replace: true
	    // transitions: Object
	    for (key in parent) {
	        mergeField(key);
	    }
	
	    //options参数处理
	    //返回一个link
	    for (key in child) {
	        if (!(0, _lang.hasOwn)(parent, key)) {
	            mergeField(key);
	        }
	    }
	
	    function mergeField(key) {
	        var strat = strats[key] || defaultStrat;
	        //object.create继承parent=>child
	        options[key] = strat(parent[key], child[key], vm, key);
	    }
	
	    console.log(options);
	
	    return options;
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * 配置文件
	 */
	var config = {
	
	    /**
	     * 组件列表类型
	     * @type {Array}
	     */
	    _assetTypes: ['component', 'directive', 'elementDirective', 'filter', 'transition', 'partial']
	};
	
	exports.default = config;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (Ue) {
	
		/**
	  * Ue构造器扩展
	     * 编译步骤,调用this.constructor.options”。
	  * @type {Object}
	  */
		Ue.options = {
			//指令
			directives: _index2.default
		};
	};
	
	var _index = __webpack_require__(9);
	
	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _text = __webpack_require__(10);
	
	var _text2 = _interopRequireDefault(_text);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  text: _text2.default
	}; // text & html

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _index = __webpack_require__(2);
	
	exports.default = {
	  bind: function bind() {
	    this.attr = this.el.nodeType === 3 ? 'data' : 'textContent';
	  },
	  update: function update(value) {
	    this.el[this.attr] = (0, _index._toString)(value);
	  }
	};

/***/ }
/******/ ]);
//# sourceMappingURL=build.js.map