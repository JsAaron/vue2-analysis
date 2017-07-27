import { observe } from '../observer/index'
import Watcher from '../observer/watcher'
import {
  bind,
  noop
} from '../util/index'

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function initState(vm) {
  vm._watchers = []
  const opts = vm.$options

  if (opts.methods) {
    initMethods(vm, opts.methods);
  }

  if (opts.data) {
    initData(vm)
  }

  if (opts.computed) {
    initComputed(vm, opts.computed)
  }

  if (opts.watch) {
    initWatch(vm, opts.watch)
  }

}


function initWatch(vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(vm, key, handler) {
  var options
  vm.$watch(key, handler, options);
}


/**
 * 监控属性
 * @type {Object}
 */
var computedWatcherOptions = { lazy: true };

function initComputed(vm, computed) {
  var watchers = vm._computedWatchers = Object.create(null);

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;

    //为计算属性创建实例的观察
    watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions);

    defineComputed(vm, key, userDef);
  }
}


function defineComputed(target, key, userDef) {
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = noop;
  } else {}
  Object.defineProperty(target, key, sharedPropertyDefinition);
}


function createComputedGetter(key) {
  return function computedGetter() {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}


/**
 * 初始化方法
 */
function initMethods(vm, methods) {
  for (var key in methods) {
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}



function getData(data, vm) {
  try {
    return data.call(vm)
  } catch (e) {
    return {}
  }
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
 * 在Mue中的data被start包装过
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




export function stateMixin(Mue) {

  var dataDef = {};
  dataDef.get = function() { return this._data };
  var propsDef = {};
  propsDef.get = function() { return this._props };
  Object.defineProperty(Mue.prototype, '$data', dataDef);
  Object.defineProperty(Mue.prototype, '$props', propsDef);


  Mue.prototype.$watch = function(expOrFn, cb, options) {
    var vm = this;
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn() {
      watcher.teardown();
    }
  };
}