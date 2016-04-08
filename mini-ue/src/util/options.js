import config from '../config'
import {
    extend,
    isObject,
    isArray,
    isPlainObject,
    hasOwn,
    camelize,
    hyphenate
} from './lang'

var strats = config.optionMergeStrategies = Object.create(null)


/**
 * 助手递归合并两个数据对象在一起
 * @param  {[type]} to   [description]
 * @param  {[type]} from [description]
 * @return {[type]}      [description]
 */
function mergeData(to, from) {
    var key, toVal, fromVal
    for (key in from) {
        toVal = to[key]
        fromVal = from[key]
        if (!hasOwn(to, key)) {
            set(to, key, fromVal)
        } else if (isObject(toVal) && isObject(fromVal)) {
            mergeData(toVal, fromVal)
        }
    }
    return to
}


/**
 * 当存在一个vm(实例创建), 我们需要做的 
 * 构造函数之间的三方合并选项, 实例
 * @param  {[type]} parentVal [description]
 * @param  {[type]} childVal  [description]
 * @return {[type]}           [description]
 */
function mergeAssets(parentVal, childVal) {
    var res = Object.create(parentVal);
    return childVal ? extend(res, guardArrayAssets(childVal)) : res;
}
config._assetTypes.forEach(function(type) {
    strats[type + 's'] = mergeAssets;
});

strats.data = function(parentVal, childVal, vm) {
    return function mergedInstanceDataFn() {
        // instance merge
        var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal
        var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined
        if (instanceData) {
            return mergeData(instanceData, defaultData)
        } else {
            return defaultData
        }
    }
}

strats.el = function(parentVal, childVal, vm) {
    var ret = childVal || parentVal
    return ret   
}

strats.props = strats.methods = strats.computed = function(parentVal, childVal) {
    if (!childVal) return parentVal
    if (!parentVal) return childVal
    var ret = Object.create(null)
    extend(ret, parentVal)
    extend(ret, childVal)
    return ret
};

function guardArrayAssets(assets) {
    console.log(assets)
}

/**
 * 默认策略
 */
var defaultStrat = function(parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal
}

/**
 * 合并
 * 将两个选项对象合并为一个新的
 * @return {[type]} [description]
 */
export function mergeOptions(parent, child, vm) {

    var options = {}
    var key

    //optons:
    // components: Object
    // directives: Object
    // elementDirectives: Object
    // filters: Object
    // partials: Object
    // replace: true
    // transitions: Object
    for (key in parent) {
        mergeField(key)
    }

    //options参数处理
    //返回一个link
    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeField(key);
        }
    }

    function mergeField(key) {
        var strat = strats[key] || defaultStrat
        //object.create继承parent=>child
        options[key] = strat(parent[key], child[key], vm, key)
    }

    return options
}



export function resolveAsset (options, type, id) {
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type]
  var camelizedId

  return assets[id] ||
    // camelCase ID
    assets[camelizedId = camelize(id)] ||
    // Pascal Case ID
    assets[camelizedId.charAt(0).toUpperCase() + camelizedId.slice(1)]
}

