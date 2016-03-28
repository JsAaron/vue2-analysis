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
import Watcher from '../watcher'
import Dep from '../observer/dep'

function noop() {}

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

    //所有指令合集
    this._directives = []
        //所有观察对象
    this._watchers = []

    //初始化空数据
    //通过_initScope方法填充
    this._data = {}
    this._initState()


    //el存在,开始编译
    if (options.el) {
        this.$mount(options.el);
    }
    console.log("####", this)
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
        //事件
    this._initMethods()
        //data
        //构建原始数据的观察
    this._initData()
        //初始化计算属性
    this._initComputed();
}
 


/**
 * 初始化计算属性
 * 本质上来说，是特殊的setter/getter
 * @return {[type]} [description]
 */
Ue.prototype._initComputed = function() {
    var computed = this.$options.computed;
    //object
    if (computed) {
        for (var key in computed) {
            var userDef = computed[key];
            //设置属可观察可修改
            var def = {
                enumerable: true,
                configurable: true
            };
            //如果计算属性是函数
            //那么意味着就是默认的getter处理
            //set =>null
            if (typeof userDef === 'function') {
                def.get = makeComputedGetter(userDef, this);
                def.set = noop;
            } else {
                alert('计算属性不是函数')
            }

            //计算属性挂到vue的实例上
            Object.defineProperty(this, key, def);
        }
    }
}

/**
 * 制作一个计算的getter linker
 *
 * 计算属性
 *  new Watcher
 *     内部 new Watcher
 *
 *   computed: {
 *       b: function() {
 *           var a = this.name;
 *           var b = this.message
 *           return a +" " +b
 *       }
 *   }
 *
 *  b方法通过watcher包装,成为getter方法
 *
 * Directive._bind
 *  建立b的 watcher对象,内部调用getter
 *  getter其实是一个内建的watcher对象
 *  用来收集 this.name, this.meassge的依赖
 *
 * this.name 
 *   subs:订阅关系
 *     watcher  {{}}文本节点
 *     watcher  内建watcher对象
 *     watcher  外建watcher对象
 *
 * 内建watcher对象
 *     deps 
 *       Dep this.name
 *       Dep this.message  
 *          
 * 
 * 
 * @param  {[type]} getter [description]
 * @param  {[type]} owner  [description]
 * @return {[type]}        [description]
 */
function makeComputedGetter(getter, owner) {
    var watcher = new Watcher(owner, getter, null, {
        lazy: true
    });
    return function computedGetter() {
        //求值属性
        //懒加载有依赖
        //所以先要求出依赖的值
        //指定依赖的观察
        if (watcher.dirty) {
            watcher.evaluate();
        }

        //让外watcher与子watcher产生的deps产生关系
        if (Dep.target) {
            watcher.depend();
        }
        return watcher.value;
    };
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
 * 在外面访问
 * data ={
 *    message:'aaaa'
 * }
 * this.message = > vm._data.message
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
