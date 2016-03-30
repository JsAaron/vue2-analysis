/**
 * 指令
 *  v-on
 *  v-text
 */
import directives from './directives/index'
import {
    warn,
    query,
    hasOwn,
    bind
}
from './util/index'

/**
 * Ue构造器
 * @param {[type]} options [description]
 */
class Ue {

    constructor(options) {
        this._init(options)
    }

    _init(options) {
        options = options || {}
        this.$el = null;

        //初始化空数据
        //通过_initScope方法填充
        this._data = {};
        this._initState()

        //所有指令合集
        this._directives = [];
        //所有观察对象
        this._watchers = [];

        var el = document.querySelector(el);
        // this._compile(el);

        console.log("####", this)
    }

    _initState() {
        //data数据处理
        this._initData();
    }


    _initData() {
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
    _proxy(key) {
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
    };


    /**
     * 开始编译
     * @param  {[type]} el [description]
     * @return {[type]}    [description]
     */
    _compile(el) {

    }


    _initMethods() {

    }


}


/**
 * Ue构造器扩展
 * 编译步骤,调用this.constructor.options”。
 * @type {Object}
 */
Ue.options = {
    //指令
    directives
}

export default Ue

window.Ue = Ue;
