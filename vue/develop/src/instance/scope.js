var _ = require('../util')
var compiler = require('../compiler')
var Observer = require('../observer')
var Dep = require('../observer/dep')
var Watcher = require('../watcher')

/**
 * Setup the scope of an instance, which contains:
 * - observed data
 * - computed properties
 * - user methods
 * - meta properties
 */

exports._initScope = function() {
    //el props
    this._initProps()
        //元素性 v-repeat创建的 vm.$key vm.$index vm.$value
    this._initMeta()
        //制作事件的curry的方法,传递this //vm
    this._initMethods()
        //初始化data
    this._initData()
        //计算属性
    this._initComputed()
}

/**
 * Initialize props.
 */

exports._initProps = function() {
    var options = this.$options
    var el = options.el
        //指定父类数据
    var props = options.props
    if (props && !el) {
        process.env.NODE_ENV !== 'production' && _.warn(
            'Props will not be compiled if no `el` option is ' +
            'provided at instantiation.'
        )
    }
    //确保选择器字符串转换成现在的元素
    // make sure to convert string selectors into element now
    el = options.el = _.query(el)
    this._propsUnlinkFn = el && el.nodeType === 1 && props ? compiler.compileAndLinkProps(
        this, el, props
    ) : null
}

/**
 * Initialize the data.
 */

exports._initData = function() {
    var propsData = this._data
    var optionsDataFn = this.$options.data;
    //求出data
    //如果是传递的一个字方法，函数包装
    //optionsDataFn
    //var MyComponent = Vue.extend({
    //   data: function () {
    //     return {
    //       message: 'some default data.',
    //       object: {
    //         fresh: true
    //       }
    //     }
    //   }
    // })
    var optionsData = optionsDataFn && optionsDataFn()
    if (optionsData) {
        this._data = optionsData
        for (var prop in propsData) {
            if (
                this._props[prop].raw !== null ||
                !optionsData.hasOwnProperty(prop)
            ) {
                optionsData.$set(prop, propsData[prop])
            }
        }
    }
    //模型数据
    var data = this._data
        // proxy data on instance
    var keys = Object.keys(data)
    var i, key
    i = keys.length
    while (i--) {
        key = keys[i]
            //检查$开头
        if (!_.isReserved(key)) {
            //生成data中数据的defineProperty
            //this.[data]...set/get
            //操作this._data的值  
            this._proxy(key)
        }
    }
    // observe data
    Observer.create(data, this)
}

/**
 * Swap the isntance's $data. Called in $data's setter.
 *
 * @param {Object} newData
 */

exports._setData = function(newData) {
    newData = newData || {}
    var oldData = this._data
    this._data = newData
    var keys, key, i
        // copy props.
        // this should only happen during a v-repeat of component
        // that also happens to have compiled props.
    var props = this.$options.props
    if (props) {
        i = props.length
        while (i--) {
            key = props[i].name
            if (key !== '$data' && !newData.hasOwnProperty(key)) {
                newData.$set(key, oldData[key])
            }
        }
    }
    // unproxy keys not present in new data
    keys = Object.keys(oldData)
    i = keys.length
    while (i--) {
        key = keys[i]
        if (!_.isReserved(key) && !(key in newData)) {
            this._unproxy(key)
        }
    }
    // proxy keys not already proxied,
    // and trigger change for changed values
    keys = Object.keys(newData)
    i = keys.length
    while (i--) {
        key = keys[i]
        if (!this.hasOwnProperty(key) && !_.isReserved(key)) {
            // new property
            this._proxy(key)
        }
    }
    oldData.__ob__.removeVm(this)
    Observer.create(newData, this)
    this._digest()
}

/**
 * Proxy a property, so that
 * vm.prop === vm._data.prop
 *
 * @param {String} key
 * option.data
 * 生成this.[...] set/get
 */

exports._proxy = function(key) {
    // need to store ref to self here
    // because these getter/setters might
    // be called by child instances!
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
 * Unproxy a property.
 *
 * @param {String} key
 */

exports._unproxy = function(key) {
    delete this[key]
}

/**
 * Force update on every watcher in scope.
 */

exports._digest = function() {
    var i = this._watchers.length
    while (i--) {
        this._watchers[i].update(true) // shallow updates
    }
    var children = this.$children
    i = children.length
    while (i--) {
        var child = children[i]
        if (child.$options.inherit) {
            child._digest()
        }
    }
}

/**
 * Setup computed properties. They are essentially
 * special getter/setters
 */

function noop() {}
exports._initComputed = function() {
    var computed = this.$options.computed
    if (computed) {
        for (var key in computed) {
            var userDef = computed[key]
            var def = {
                enumerable: true,
                configurable: true
            }
            if (typeof userDef === 'function') {
                def.get = makeComputedGetter(userDef, this)
                def.set = noop
            } else {
                def.get = userDef.get ? userDef.cache !== false ? makeComputedGetter(userDef.get, this) : _.bind(userDef.get, this) : noop
                def.set = userDef.set ? _.bind(userDef.set, this) : noop
            }
            Object.defineProperty(this, key, def)
        }
    }
}

function makeComputedGetter(getter, owner) {
    var watcher = new Watcher(owner, getter, null, {
        lazy: true
    })
    return function computedGetter() {
        if (watcher.dirty) {
            watcher.evaluate()
        }
        if (Dep.target) {
            watcher.depend()
        }
        return watcher.value
    }
}

/**
 * Setup instance methods. Methods must be bound to the
 * instance since they might be called by children
 * inheriting them.
 */

exports._initMethods = function() {
    var methods = this.$options.methods
    if (methods) {
        for (var key in methods) {
            this[key] = _.bind(methods[key], this)
        }
    }
}

/**
 * Initialize meta information like $index, $key & $value.
 */

exports._initMeta = function() {
    var metas = this.$options._meta
    if (metas) {
        for (var key in metas) {
            this._defineMeta(key, metas[key])
        }
    }
}

/**
 * Define a meta property, e.g $index, $key, $value
 * which only exists on the vm instance but not in $data.
 *
 * @param {String} key
 * @param {*} value
 */

exports._defineMeta = function(key, value) {
    var dep = new Dep()
    Object.defineProperty(this, key, {
        get: function metaGetter() {
            if (Dep.target) {
                dep.depend()
            }
            return value
        },
        set: function metaSetter(val) {
            if (val !== value) {
                value = val
                dep.notify()
            }
        }
    })
}
