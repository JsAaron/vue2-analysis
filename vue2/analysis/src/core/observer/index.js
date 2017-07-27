import Dep from './dep'
import { arrayMethods } from './array'
import {
  def,
  hasOwn,
  isObject,
  isPlainObject
} from '../util/index'


/**
 * push pop shift unshift splice sort reverse
 * @type {[type]}
 */
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)


export function Observer(value) {
  this.value = value;

  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);

  if (Array.isArray(value)) {
    /*增强数组的处理方法，重写数组的处理方法*/
    protoAugment(value, arrayMethods, arrayKeys);
    //观察数组，其实也是在数据内部递归observe
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};


/**
 * 遍历对象属性，转化成setter getter
 */
Observer.prototype.walk = function walk(obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]])
  }
};


/**
 * 观察数据合集
 */
Observer.prototype.observeArray = function observeArray(items) {
  for (var i = 0, l = items.length; i < l; i++) {
    //继续递归分解
    observe(items[i]);
  }
};


/**
 * 通过截取来增强目标对象或数组
 * 使用__proto__原型链
 */
function protoAugment(target, src) {
  target.__proto__ = src;
}




/**
 * 针对数据进行观察
 * 遍历每个需要观察的对象
 *
 * data ={
 *   gridColumns:[a,b], protoype =>{
 *     __ob__ => Observer =>{ dep , value , vmCount}
 *     __proto__ =>重写push等原生方法
 *   }
 *   searchQuery:''
 * }
 *
 * this =>{
 *   dep
 *   value=>data
 *   vmCount
 * }
 */
export function observe(value, asRootData) {
  //数组递归的时候，子数据是简单类型，那么就不执行
  if (!isObject(value)) {
    return
  }

  var ob;
  if (hasOwn(value, '__ob__')) {
    console.log(123)
    // ob = value.__ob__;
  } else if (Array.isArray(value) || isPlainObject(value)) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}



/**
 * 给每个数据对象上定义一些属性
 */
export function defineReactive(obj, key, val, customSetter) {
  var dep = new Dep();

  //获取defineProperty方法设置的property 特性
  var property = Object.getOwnPropertyDescriptor(obj, key);

  var getter = property && property.get;
  var setter = property && property.set;

  //如果有子数据，并且不是对象
  var childOb = observe(val);

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      var value = val;
      //在获取这个值的时候，如果有watcher的依赖
      if (Dep.target) {
        dep.depend();
      }

    },
    set: function reactiveSetter(newVal) {
      console.log(11)
    }
  });

}