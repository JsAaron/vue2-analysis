/*!
 * vue-analysis 
 * (c) 2016 Aaron
 * https://github.com/JsAaron/vue-analysis
 */
'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/**
 * 查询一个元素选择器
 * @param {String|Element} el
 * @return {Element}
 */
var query = function query(el) {
    if (typeof el === 'string') {
        var selector = el;
        el = document.querySelector(el);
    }
    return el;
};

/**
 * 定义个对象属性
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 * @param {Boolean} [enumerable]
 */
var def = function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
};

var uid = 0;

/**
 * dep是一种观察可以被多个指令订阅它
 */

var Dep = function Dep() {
    classCallCheck(this, Dep);

    this.id = uid++;
    this.subs = [];
};

/**
 * 给一个对象定义一个响应式属性
 */


var defineReactive = function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function get() {},
        set: function set(newVal) {}
    });
};

/**
 * 建立数据观察
 */

var Observer = function () {
    function Observer(value) {
        classCallCheck(this, Observer);

        this.value = value;
        this.dep = new Dep();
        def(value, '__ob__', this);
        this.walk(value);
    }

    /**
     * 通过each方法把每一个属性转化成getter/getter
     * 只有当值是对象的时候才能被调用
     */


    createClass(Observer, [{
        key: 'walk',
        value: function walk(obj) {
            var keys = Object.keys(obj);
            for (var i = 0, l = keys.length; i < l; i++) {
                this.convert(keys[i], obj[keys[i]]);
            }
        }

        /**
         * 转化一个属性变成getter/setter
         * 当属性存取或者改变的时候，我们能触发这个事件
         */

    }, {
        key: 'convert',
        value: function convert(key, val) {
            defineReactive(this.value, key, val);
        }

        /**
         * 增加一个所有者的vm
         */

    }, {
        key: 'addVm',
        value: function addVm(vm) {
            (this.vms || (this.vms = [])).push(vm);
        }
    }]);
    return Observer;
}();

var observe = function observe(value, vm) {
    var ob = void 0;
    ob = new Observer(value);
    if (ob && vm) {
        ob.addVm(vm);
    }
    return ob;
};

/**
 * 构造器
 */

var XXT = function () {
    function XXT() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? options || {} : arguments[0];
        classCallCheck(this, XXT);

        this.$options = options;

        //初始化数据观察与需要的工具继承
        this._initState();

        //开始编译
        if (options.el) {
            this.$mount(options.el);
        }
    }

    /**
     * 初始化数据状态
     */


    createClass(XXT, [{
        key: '_initState',
        value: function _initState() {
            this._initProps();
            this._initData();
        }

        /**
         * 初始化属性
         */

    }, {
        key: '_initProps',
        value: function _initProps() {
            var options = this.$options;
            var el = options.el;
            options.el = query(el);
        }

        /**
         * 初始data
         */

    }, {
        key: '_initData',
        value: function _initData() {
            var data = this._data = this.$options.data;

            //代理实例
            var keys = Object.keys(data);
            var i = void 0,
                key = void 0;
            i = keys.length;
            while (i--) {
                key = keys[i];
                this._proxy(key);
            }

            observe(data, this);
        }

        /**
         * 代理属性，所以
         * vm.prop === vm._data.prop
         */

    }, {
        key: '_proxy',
        value: function _proxy(key) {
            var _this = this;

            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: true,
                get: function get() {
                    return _this._data[key];
                },
                set: function set(val) {
                    _this._data[key] = val;
                }
            });
        }
    }, {
        key: '$mount',
        value: function $mount(el) {
            el = query(el);
            this._compile(el);
        }

        /**
         * 编译与链接元素
         */

    }, {
        key: '_compile',
        value: function _compile(el) {
            var options = this.$options;
            console.log(options);
        }
    }]);
    return XXT;
}();

window.XXT = XXT;