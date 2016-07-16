let hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * 检查是否为对象的属性
 * @param {Object} obj
 * @param {String} key
 * @return {Boolean}
 */
let hasOwn = (obj, key) => {
    return hasOwnProperty.call(obj, key);
}

/**
 * 选择覆盖策略函数处理
 * 如何合并父选项值和一个子的选择的值变成最终值
 * 
 * 有策略函数遵循相同的签名
 */
let strats = Object.create(null);


/**
 * 递归合并两个数据对象在一起
 */
let mergeData = (to, from) => {
    let key, toVal, fromVal;
    for (key in from) {
        toVal = to[key];
        fromVal = from[key];
        if (!hasOwn(to, key)) {
            set(to, key, fromVal);
        } else if (isObject(toVal) && isObject(fromVal)) {
            mergeData(toVal, fromVal);
        }
    }
    return to;
}


/**
 * Mix properties into target object.
 *
 * @param {Object} to
 * @param {Object} from
 */

function extend(to, from) {
    var keys = Object.keys(from);
    var i = keys.length;
    while (i--) {
        to[keys[i]] = from[keys[i]];
    }
    return to;
}


/**
 * El
 */
strats.el = function(parentVal, childVal, vm) {
    let ret = childVal || parentVal;
    //过是一个合并的实例，调用元素的工厂方法
    return vm && typeof ret === 'function' ? ret.call(vm) : ret
}

/**
 * Data
 * return mergedInstanceDataFn
 */
strats.data = (parentVal, childVal, vm) => {
    if (parentVal || childVal) {
        return () => {
            // instance merge
            //如果是值是函数
            let instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
            let defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
            if (instanceData) {
                return mergeData(instanceData, defaultData);
            } else {
                return defaultData;
            }
        }
    }
}

/**
 * Other object hashes.
 */

strats.props = strats.methods = strats.computed = function(parentVal, childVal) {
    if (!childVal) return parentVal;
    if (!parentVal) return childVal;
    var ret = Object.create(null);
    extend(ret, parentVal);
    extend(ret, childVal);
    return ret;
};

function mergeAssets(parentVal, childVal) {
    var res = Object.create(parentVal || null);
    return childVal ? extend(res, guardArrayAssets(childVal)) : res;
}

strats.directives = mergeAssets

/**
 * 合并2个参数对象变成一个新的
 * 核心工具用于实例化和继承
 */
export function mergeOptions(parent, child, vm) {
    let options = {}
    let key
    let mergeField = (key) => {
        let strat = strats[key]
        options[key] = strat(parent[key], child[key], vm, key);
    }
    for (key in parent) {
        mergeField(key)
    }
    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeField(key)
        }
    }
    return options
}