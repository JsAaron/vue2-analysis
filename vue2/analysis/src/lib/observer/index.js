import Dep from './dep'
import {
  def,
  hasOwn,
  isObject,
  isPlainObject
} from '../util/index'



export function Observer(value) {
  this.value = value;

  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);

  this.walk(value);
};



Observer.prototype.walk = function walk(obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]])
  }
};



export function observe(value, asRootData) {

  if (!isObject(value)) {
    return
  }

  var ob;
  if (hasOwn(value, '__ob__')) {
    console.log(123)
    // ob = value.__ob__;
  } else if (Array.isArray(value) || isPlainObject(value)) {
    ob = new Observer(value);
    console.log(ob)
  }
  // if (asRootData && ob) {
  //   ob.vmCount++;
  // }
  // return ob
}



/**
 * Define a reactive property on an Object.
 */
export function defineReactive(obj, key, val, customSetter) {
  var dep = new Dep();

  //获取defineProperty方法设置的property 特性
  var property = Object.getOwnPropertyDescriptor(obj, key);

  var getter = property && property.get;
  var setter = property && property.set;




}