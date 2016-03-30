/*!
 * build.js vundefined
 * (c) 2016 Aaron
 * Released under the MIT License.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.build = factory());
}(this, function () { 'use strict';

    var babelHelpers = {};
    babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
    };

    babelHelpers.classCallCheck = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };

    babelHelpers.createClass = function () {
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

    babelHelpers;

    var on = {
        test: 'on',

        acceptStatement: true,

        bind: function bind() {},
        update: function update(handler) {
            this.handler = handler;
            this.el.addEventListener(this.arg, this.handler, "fasle");
        }
    };

    var text = {

        test: 'text',

        bind: function bind() {
            this.attr = this.el.nodeType === 3 ? 'data' : 'textContent';
        },

        update: function update(value) {
            this.el[this.attr] = value;
        }
    };

    var directives = {
        on: on,
        text: text
    };

    /**
     * Ue构造器
     * @param {[type]} options [description]
     */

    var Ue = function () {
        function Ue(options) {
            babelHelpers.classCallCheck(this, Ue);

            this._init(options);
        }

        babelHelpers.createClass(Ue, [{
            key: '_init',
            value: function _init(options) {
                options = options || {};
                this.$el = null;

                //初始化空数据
                //通过_initScope方法填充
                this._data = {};
                this._initState();

                //所有指令合集
                this._directives = [];
                //所有观察对象
                this._watchers = [];

                var el = document.querySelector(el);
                // this._compile(el);

                console.log("####", this);
            }
        }, {
            key: '_initState',
            value: function _initState() {
                //data数据处理
                this._initData();
            }
        }, {
            key: '_initData',
            value: function _initData() {
                var data = this.$options.data;
                var keys = Object.keys(data);
                var i, key;
                i = keys.length;
                while (i--) {
                    key = keys[i];
                    this._proxy(key);
                }
            }

            /**
             * 生成数据代理
             * @param  {[type]} key [description]
             * @return {[type]}     [description]
             */

        }, {
            key: '_proxy',
            value: function _proxy(key) {
                var self = this;
                Object.defineProperty(self, key, {
                    configurable: true,
                    enumerable: true,
                    get: function proxyGetter() {
                        return self._data[key];
                    },
                    set: function proxySetter(val) {
                        self._data[key] = val;
                    }
                });
            }
        }, {
            key: '_compile',


            /**
             * 开始编译
             * @param  {[type]} el [description]
             * @return {[type]}    [description]
             */
            value: function _compile(el) {}
        }, {
            key: '_initMethods',
            value: function _initMethods() {}
        }]);
        return Ue;
    }();

    /**
     * Ue构造器扩展
     * 编译步骤,调用this.constructor.options”。
     * @type {Object}
     */


    Ue.options = {
        //指令
        directives: directives
    };

    window.Ue = Ue;

    return Ue;

}));