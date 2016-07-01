import {
    compile
} from './compile'
import {
    observe
} from './observe'
import {
    mergeOptions
} from './options'


/**
 * Query an element selector
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
     * Initalize data
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
        let contentUnlinkFn = compile(el, options)

    }
}

XXT.options = {
    test: 1
}




window.XXT = XXT