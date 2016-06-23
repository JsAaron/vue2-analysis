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

let observe = (value, vm) => {
    if (!value || typeof value !== 'object') {
        return;
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
    } else if (shouldConvert && (isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
        ob = new Observer(value);
    }
    if (ob && vm) {
        ob.addVm(vm);
    }
    return ob;
}

/**
 * 构造器
 */
class XXT {

    constructor(options = options || {}) {
        this.$options = options

        this._initState()
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
        });
    }
}


window.XXT = XXT