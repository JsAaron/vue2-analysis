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



var uid = 0;

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
 * 给一个对象定义一个响应式属性
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


let observe = (value, vm) => {
    let ob
    ob = new Observer(value)
    if (ob && vm) {
        ob.addVm(vm)
    }
    return ob
}


/**
 * 构造器
 */
class XXT {

    constructor(options = options || {}) {
        this.$options = options

        //初始化数据观察与需要的工具继承
        this._initState()

        //开始编译
        if (options.el) {
            this.$mount(options.el);
        }
    }

    /**
     * 初始化数据状态
     */
    _initState() {
        this._initProps()
        this._initData()
    }

    /**
     * 初始化属性
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
        let data = this._data = this.$options.data

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

    }
}


window.XXT = XXT