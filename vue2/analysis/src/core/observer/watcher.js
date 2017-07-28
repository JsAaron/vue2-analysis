/*  */
import {
  _Set as Set,
  parsePath
} from '../util/index'

import Dep, { pushTarget, popTarget } from './dep'

var uid = 0;

/**
 * 建议相互的依赖观察关系
 * @param {[type]}   vm      [实例this]
 * @param {[type]}   expOrFn [解析的表达式]
 * @param {Function} cb      [执行的回调函数]
 * @param {[type]}   options [参数]
 * 计算属性 lazy false
 * watch   lazy true
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
 * 执行getter方法，并且收集依赖
 */
Watcher.prototype.get = function get() {
  //把这个wather的实例对象挂到全局中Dep.target中
  pushTarget(this);
  var value;
  var vm = this.vm;
  value = this.getter.call(vm, vm);
  popTarget();
  this.cleanupDeps();
  return value
};

/**
 * wather-get => _data =>
 * 观察数据data中 针对每个属性，会生成Dep对象，传递dep
 */
Watcher.prototype.addDep = function addDep(dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      //把这个观察的对象Wather对象加入到应用属性的Dep中
      dep.addSub(this);
    }
  }
};


/**
 * 清理依赖收集
 * 为了去重复处理
 * deps记录data的dep对象引用
 * depIds 记录data的dep的Id
 */
Watcher.prototype.cleanupDeps = function cleanupDeps() {
  let i = this.deps.length
  while (i--) {
    const dep = this.deps[i]
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this)
    }
  }
  let tmp = this.depIds
  this.depIds = this.newDepIds
  this.newDepIds = tmp
  this.newDepIds.clear()
  tmp = this.deps
  this.deps = this.newDeps
  this.newDeps = tmp
  this.newDeps.length = 0
};