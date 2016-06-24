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
 * Compile the directives on an element and return a linker
 */
let compileDirectives = (attrs, options) => {
    let i = attrs.length;
    let dirs = [];
    let attr, name, value
    while (i--) {
        attr = attrs[i]
        name = attr.name
        value = attr.value

        //normal directives
        console.log(name)
    }
}

let linkAndCapture = () => {

}

/**
 * Compile the root element of an instance
 * 1. attrs on context container (context scope)
 */
let compileRoot = (el, options) => {
    let replacerLinkFn

    //just compile as a normal element
    replacerLinkFn = compileDirectives(el.attributes, options)

    //rootLinkFn
    return (vm, el) => {

        // link self
        let selfDirs = linkAndCapture(() => {
            if (replacerLinkFn) replacerLinkFn(vm, el);
        }, vm)

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
 * 定义个对象属性
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 * @param {Boolean} [enumerable]
 */
let def = (obj, key, val, enumerable) => {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
}



let uid = 0;

/**
 * dep是一种观察可以被多个指令订阅它
 */
class Dep {
    constructor() {
        this.id = uid++;
        this.subs = [];
    }
}


/**
 * Define a reactive property on an Object
 */
let defineReactive = (obj, key, val) => {
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => {

        },
        set: (newVal) => {

        }
    })
}


/**
 * 建立数据观察
 * 观察者类连接到每个观察对象。
 * 一旦连接
 * 观察者转换目标对象的属性键到getter / setter收集依赖和分派更新
 */
class Observer {
    constructor(value) {
        this.value = value
        this.dep = new Dep();
        def(value, '__ob__', this);
        this.walk(value);
    }

    /**
     * 通过each方法把每一个属性转化成getter/getter
     * 只有当值是对象的时候才能被调用
     */
    walk(obj) {
        let keys = Object.keys(obj);
        for (let i = 0, l = keys.length; i < l; i++) {
            this.convert(keys[i], obj[keys[i]]);
        }
    }

    /**
     * 转化一个属性变成getter/setter
     * 当属性存取或者改变的时候，我们能触发这个事件
     */
    convert(key, val) {
        defineReactive(this.value, key, val);
    }

    /**
     * 增加一个所有者的vm
     */
    addVm(vm) {
        (this.vms || (this.vms = [])).push(vm)
    }
}


/**
 * 试图给一个值去创建一个观察实例
 * 成功，返回一个新的观察
 * 或者值已经存在了观察
 */
let observe = (value, vm) => {
    if (!value || typeof value !== 'object') {
        return;
    }
    let ob
    ob = new Observer(value)
    if (ob && vm) {
        ob.addVm(vm)
    }
    return ob
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

        // rootLinker is a compile linker
        // return a linker function
        let rootLinker = compileRoot(el, options)

        //must sure to link root with prop scope
        let rootUnlinkFn = rootLinker(this, el)
    }
}



window.XXT = XXT