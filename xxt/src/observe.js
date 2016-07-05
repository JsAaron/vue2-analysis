var isArray = Array.isArray

var hasProto = ('__proto__' in {})
var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto)


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

;
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function(method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator() {
        console.log(method)
    });
});


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

    var childOb = observe(val);

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => {

        },
        set: (newVal) => {

        }
    })
}


function protoAugment(target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
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
        if (isArray(value)) {
            protoAugment(value, arrayMethods)
            this.observeArray(value)
        } else {
            this.walk(value)
        }
    }

    observeArray(items) {
        for (var i = 0, l = items.length; i < l; i++) {
            observe(items[i]);
        }
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
export function observe(value, vm) {
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