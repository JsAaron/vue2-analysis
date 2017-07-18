
import {
  observe,
} from '../observer/index'

export function initState(mve) {
  mve._watchers = []
  const opts = mve.$options

  if (opts.data) {
    initData(mve)
  }

  // if (opts.computed) {
  //   initComputed(mve, opts.computed)
  // }

  // if (opts.watch) {
  //   initWatch(mve, opts.watch)
  // }

}


function getData(data, vm) {
  try {
    return data.call(vm)
  } catch (e) {
    return {}
  }
}

/**
 * 共享的属性定义
 * @type {Object}
 */
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: function() {},
  set: function() {}
}

/**
 * 把data上的属性直接挂到实例上
 * 比如
 * data:{
 *   a:1
 * }
 * vm.data === 1
 * data的取的值是放到vm._data中的
 * 这里实现了实例直接访问属性，但是属性实际存放在_data中
 * @param  {[type]} target    [description]
 * @param  {[type]} sourceKey [description]
 * @param  {[type]} key       [description]
 * @return {[type]}           [description]
 */
export function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}


/**
 * 在vue中的data被start包装过
 * 在组件的data也必须是函数
 * @param  {[type]} vm [description]
 * @return {[type]}    [description]
 */
function initData(vm) {
  var data = vm.$options.data;

  //数据保存到_data中
  data = vm._data = typeof data === 'function' ?
    getData(data, vm) :
    data || {};

  //在实例上代理data属性
  var keys = Object.keys(data);
  var i = keys.length;
  while (i--) {
    proxy(vm, "_data", keys[i])
  }

  //观察数据
  observe(data, true);

  return data
}