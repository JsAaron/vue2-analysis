/*  */
import {
  _Set as Set,
  parsePath
} from '../util/index'


var uid = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export default function Watcher(vm, expOrFn, cb, options) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new Set();
  this.newDepIds = new Set();
  this.expression = expOrFn.toString();

  //如果只函数，表达式就是get方法
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    //否则就需要进一步解析
    this.getter = parsePath(expOrFn);
  }

  //如果没有懒加载，那么就马上获取
  //计算属性的时候lazy为true
  //watch为lazy:false
  this.value = this.lazy ?
    undefined :
    this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get() {
  // pushTarget(this);
  // var value;
  // var vm = this.vm;
  // if (this.user) {
  //   try {
  //     value = this.getter.call(vm, vm);
  //   } catch (e) {
  //     handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
  //   }
  // } else {
  //   value = this.getter.call(vm, vm);
  // }
  // // "touch" every property so they are all tracked as
  // // dependencies for deep watching
  // if (this.deep) {
  //   traverse(value);
  // }
  // popTarget();
  // this.cleanupDeps();
  // return value
};