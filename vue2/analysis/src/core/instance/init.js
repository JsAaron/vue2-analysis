import { extend, mergeOptions } from '../util/index'
import { initLifecycle, callHook } from './lifecycle'
import { initState } from './state'
// import { initProxy } from './proxy'

let uid = 0
export function initMixin(Mue) {

  Mue.prototype._init = function(options) {
    const vm = this
    vm._uid = uid++;
    vm._isMue = true

    const consOptions = resolveConstructorOptions(vm.constructor)

    vm.$options = mergeOptions(consOptions, options || {}, vm);

    /*生成代理*/
    // initProxy(vm)

    vm._self = vm


    initLifecycle(vm)

    /**
     * 初始化各种数据的状态
     * 1.data 对象生成监控函数与对应的dep对象
     * 2.watch 对象 生成对应的watcher对应，并与数据data的dep产生依赖关系
     * 3.computed 对象，生成watcher对象，但是不执行，反正一个闭包
     * 4.methods 对象，生成闭包，先不执行
     */
    initState(vm)

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  }

}




/**
 * 分解构造器中的参数
 * ...组件...
 * @param  {[type]} Ctor [description]
 * @return {[type]}      [description]
 */
export function resolveConstructorOptions(Ctor) {
  let options = Ctor.options
  return options
}