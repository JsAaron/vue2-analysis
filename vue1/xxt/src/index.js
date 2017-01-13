import {
    compile
} from './compile'
import {
    observe
} from './observer/index'
import {
    mergeOptions
} from './options'
import {
    Directive
} from './directive'
import directives from './directives/index'
import {
    Watcher
}
from './watcher'


let query = (el) => {
    if (typeof el === 'string') {
        let selector = el;
        el = document.querySelector(el);
    }
    return el;
}


function bind(fn, ctx) {
    return function(a) {
        var l = arguments.length;
        return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
    };
}


function makeComputedGetter(getter, owner) {
    var watcher = new Watcher(owner, getter, null, {
        lazy: true
    });
    return function computedGetter() {

    }
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
        this._directives = []
        this._watchers = []

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
        this._initMethods()
        this._initData()
        this._initComputed()
    }

    /**
     * Initalize props
     */
    _initProps() {
        let options = this.$options
        let el = options.el
        options.el = query(el)
    }

    _initMethods() {
        var methods = this.$options.methods;
        if (methods) {
            for (var key in methods) {
                this[key] = bind(methods[key], this);
            }
        }
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


    _initComputed() {
        var computed = this.$options.computed;
        if (computed) {
            for (var key in computed) {
                var userDef = computed[key];
                var def = {
                    enumerable: true,
                    configurable: true
                };
                if (typeof userDef === 'function') {
                    def.get = makeComputedGetter(userDef, this);
                    def.set = function() {};
                } else {

                }
                Object.defineProperty(this, key, def);
            }
        }
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
        if (options.replace) {
            replace(original, el);
        }
    }

    _bindDir(descriptor, node) {
        this._directives.push(new Directive(descriptor, this, node))
    }
}

XXT.options = {
    directives
}

window.XXT = XXT