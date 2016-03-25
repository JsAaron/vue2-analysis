import {
    observe
}
from '../observer/index'

import {
    warn,
    mergeOptions,
    query
}
from '../util/index'

import {
    compile
}
from '../compiler/index'

import Directive from '../directive'


/**
 * Ue构造器
 * @param {[type]} options [description]
 */
function Ue(options) {
    this._init(options)
}


Ue.prototype._init = function(options) {
    options = options || {}
    this.$el = null;

    //合并options参数
    options = this.$options = mergeOptions(
        this.constructor.options,
        options,
        this
    )

    //初始化空数据
    //通过_initScope方法填充
    this._data = {}
    this._initState()

    //所有指令合集
    this._directives = []
    //所有观察对象
    this._watchers = []

    //el存在,开始编译
    if (options.el) {
        this.$mount(options.el);
    }
    console.log(this)
}


Object.defineProperty(Ue.prototype, '$data', {
    get: function() {
        return this._data
    },
    set: function(newData) {
        if (newData !== this._data) {
            this._setData(newData)
        }
    }
})

 
/**
 * 构建实例的作用域
 * 包含
 * 观察 data
 * @return {[type]} [description]
 */
Ue.prototype._initState = function() {
    this._initProps()
    this._initMethods()
    this._initData()
}


/**
 * 初始化props属性
 * @return {[type]} [description]
 */
Ue.prototype._initProps = function() {
    var options = this.$options
    var el = options.el
    var props = options.props
    if (props && !el) {
        warn(
            '在实例化的时候,如果没有el,props不会被变异'
        )
    }
    //确保选择器字符串转换成现在的元素
    el = options.el = query(el)

}


/**
 * 简单绑定
 * 比本地化更快
 * @param  {Function} fn  [description]
 * @param  {[type]}   ctx [description]
 * @return {[type]}       [description]
 */
function bind(fn, ctx) {
    return function(a) {
        var l = arguments.length;
        return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
    };
}


/**
 * 构建方法
 * 方法必须要绑定到实例
 * 可能代替prop作为一个子组件
 * @return {[type]} [description]
 */
Ue.prototype._initMethods = function() {
    var methods = this.$options.methods;
    if (methods) {
        for (var key in methods) {
            this[key] = bind(methods[key], this);
        }
    }
}


/**
 * 初始化数据
 * @return {[type]} [description]
 */
Ue.prototype._initData = function() {
    var dataFn = this.$options.data;
    var data = this._data = dataFn ? dataFn() : {};
    var props = this._props;
    var keys = Object.keys(data);
    var i, key;
    i = keys.length;
    while (i--) {
        key = keys[i];
        this._proxy(key);
    }

    observe(data, this);
};


/**
 * 代理一个属性,所以
 * vm.prop === vm._data.prop
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
Ue.prototype._proxy = function(key) {
    var self = this
    Object.defineProperty(self, key, {
        configurable: true,
        enumerable: true,
        get: function proxyGetter() {
            return self._data[key]
        },
        set: function proxySetter(val) {
            self._data[key] = val
        }
    })
}


/**
 * 开始编译
 * @return {[type]} [description]
 */
Ue.prototype.$mount = function(el) {
    el = query(el)
    if (!el) {
        el = document.createElement('div')
    }
    //开始编译
    this._compile(el)
}

/**
 * Transclude,编译和链接元素
 * 
 * @param  {[type]} el [description]
 * @return {[type]}    [description]
 */
Ue.prototype._compile = function(el) {
    var options = this.$options;
    //编译节点
    var contentUnlinkFn = compile(el, options)(this, el);
}


/**
 * 给元素创建并且绑定一个指定
 * @param  {[type]} descriptor [description]
 * @param  {[type]} node       [description]
 * @param  {[type]} host       [description]
 * @param  {[type]} scope      [description]
 * @param  {[type]} frag       [description]
 * @return {[type]}            [description]
 */
Ue.prototype._bindDir = function(descriptor, node, host, scope, frag) {
    this._directives.push(new Directive(descriptor, this, node, host, scope, frag));
};


export default Ue
