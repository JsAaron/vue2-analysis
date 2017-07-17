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

    /*对数据进行观察 data的参数对象转化成=> vm._data*/
    initState(vm)


    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  }


  Mue.prototype.$mount = function(el, hydrating) {
    el = el && query(el);
    var template = getOuterHTML(el);
    console.log(template)
  };


}




function query(el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      "development" !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
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