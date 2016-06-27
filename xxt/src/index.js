import {
    compile
} from './compile'
import {
    observe
} from './observe'

let hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * 检查是否为对象的属性
 * @param {Object} obj
 * @param {String} key
 * @return {Boolean}
 */
let hasOwn = (obj, key) => {
    return hasOwnProperty.call(obj, key);
}

/**
 * 选择覆盖策略函数处理
 * 如何合并父选项值和一个子的选择的值变成最终值
 * 
 * 有策略函数遵循相同的签名
 */
let strats = Object.create(null);


/**
 * 递归合并两个数据对象在一起
 */
let mergeData = (to, from) => {
    let key, toVal, fromVal;
    for (key in from) {
        toVal = to[key];
        fromVal = from[key];
        if (!hasOwn(to, key)) {
            set(to, key, fromVal);
        } else if (isObject(toVal) && isObject(fromVal)) {
            mergeData(toVal, fromVal);
        }
    }
    return to;
}

/**
 * El
 */
strats.el = function(parentVal, childVal, vm) {
    let ret = childVal || parentVal;
    //过是一个合并的实例，调用元素的工厂方法
    return vm && typeof ret === 'function' ? ret.call(vm) : ret
}

/**
 * Data
 * return mergedInstanceDataFn
 */
strats.data = (parentVal, childVal, vm) => {
    if (parentVal || childVal) {
        return () => {
            // instance merge
            //如果是值是函数
            let instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
            let defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
            if (instanceData) {
                return mergeData(instanceData, defaultData);
            } else {
                return defaultData;
            }
        }
    }
}


/**
 * 查询一个元素选择器
 * @param {String|Element} el
 * @return {Element}
 */
let query = (el) => {
    if (typeof el === 'string') {
        let selector = el;
        el = document.querySelector(el);
    }
    return el;
}


/**
 * 合并2个参数对象变成一个新的
 * 核心工具用于实例化和继承
 */
let mergeOptions = (parent, child, vm) => {
    let options = {}
    let mergeField = (key) => {
        let strat = strats[key]
        options[key] = strat(parent[key], child[key], vm, key);
    }
    for (let key in child) {
        if (!hasOwn(parent, key)) {
            mergeField(key);
        }
    }
    return options
}


/**
 * constructor class
 */
class XXT {

    constructor(options = options || {}) {

        //merge options
        options = this.$options = mergeOptions(this.constructor.options, options, this)

        //initalize data as empty object
        //it will be filled up in _initState method
        this._data = {}

        //all directives
        this._directives = {}

        //initalize data observation and scope inheritance
        this._initState()

        //start compilation
        if (options.el) {
            this.$mount(options.el);
        }
    }

    /**
     * Setup the scope fo an instance ,which container:
     * - observed data
     */
    _initState() {
        this._initProps()
        this._initData()
    }

    /**
     * Initalize props
     */
    _initProps() {
        let options = this.$options
        let el = options.el
        options.el = query(el)
    }

    /**
     * 初始data
     */
    _initData() {
        let dataFn = this.$options.data
        let data = this._data = dataFn ? dataFn() : {}

        //代理实例
        let keys = Object.keys(data);
        let i, key;
        i = keys.length;
        while (i--) {
            key = keys[i];
            this._proxy(key)
        }

        observe(data, this);
    }

    /**
     * 代理属性，所以
     * vm.prop === vm._data.prop
     */
    _proxy(key) {
        Object.defineProperty(this, key, {
            configurable: true,
            enumerable: true,
            get: () => {
                return this._data[key];
            },
            set: (val) => {
                this._data[key] = val;
            }
        })
    }

    $mount(el) {
        el = query(el)
        this._compile(el)
    }


    /**
     * compile and linker
     */
    _compile(el) {
        let options = this.$options

        //compile node
        let contentUnlinkFn = compile(el, options)(this, el)

    }
}

XXT.options = {
    test: 1
}




window.XXT = XXT