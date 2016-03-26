import Dep from './dep'
import {
    def,
    hasOwn,
    isArray,
    isPlainObject,
} from '../util/index'


export function Observer(value) {
    this.value = value
    this.dep = new Dep();
    //给option.data扩展一个__ob__对象
    //默认enumerable为false不能被枚举
    def(value, '__ob__', this)
        //值是数组
    if (isArray(value)) {
        console.log('isArray为处理')
    } else {
        this.walk(value)
    }
}


/**
 * 当值是对象的时候
 * 把每一个属性转化成setter/getter
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
Observer.prototype.walk = function(obj) {
    var keys = Object.keys(obj)
    for (var i = 0, l = keys.length; i < l; i++) {
        this.convert(keys[i], obj[keys[i]])
    }
}

 
/**
 * 转化一个属性转换成getter / setter
 * 所以当这个属性被改变的时候，我们能触发这个事件
 * @param {String} key
 * @param {*} val
 */
Observer.prototype.convert = function(key, val) {
    defineReactive(this.value, key, val)
}


/*
 *添加一个所有者vm,所以当设置/删除美元突变
 *发生我们可以通知所有者vm代理键和
 *消化观察者。这只是对象时调用
 *观察是一个实例的根元数据。
 */
Observer.prototype.addVm = function(vm) {
    (this.vms || (this.vms = [])).push(vm);
}


/**
 * 给对象定义活动属性
 * @param  {[type]} obj          [description]
 * @param  {[type]} key          [description]
 * @param  {[type]} val          [description]
 * @param  {[type]} doNotObserve [description]
 * @return {[type]}              [description]
 */
export function defineReactive(obj, key, val, doNotObserve) {
    var dep = new Dep()
        //属性可以被删除
    var property = Object.getOwnPropertyDescriptor(obj, key)
    if (property && property.configurable === false) {
        return
    }
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            //原始值
            var value =  val;
            //如果有依赖
            if (Dep.target) {
                dep.depend();
            }
            return value
        },
        set: function reactiveSetter(newVal) {
            // alert('get')
        }
    }) 
}

 
/**
 * 为实例的value创建观察observer
 * 成功：返回一个新的observer
 * 或者返回已经存在的observer对象
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
export function observe(value, vm) {
    //必须是对象
    if (!value || typeof value !== 'object') {
        return
    }
    var ob;
    //如果存在
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
        //数组
        //对象
        //可以被扩展
    } else if ((isArray(value) || isPlainObject(value)) && Object.isExtensible(value)) {
        ob = new Observer(value);
    }

    if (ob && vm) {
        ob.addVm(vm);
    }

    return ob;
}