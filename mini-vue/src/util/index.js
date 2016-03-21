/**
 * 错误提示
 */
let warn
const hasConsole = typeof console !== 'undefined'
warn = function(msg, e) {
    if (hasConsole) {
        console.warn('[Ue warn]: ' + msg)
    }
}
export { warn }



/**
 * 查询节点
 * @param  {[type]} el [description]
 * @return {[type]}    [description]
 */
export function query(el) {
    if (typeof el === 'string') {
        var selector = el
        el = document.querySelector(el)
        if (!el) {
            warn(
                'Cannot find element: ' + selector
            )
        }
    }
    return el
}



var strats = config.optionMergeStrategies = Object.create(null)

/**
 * 合并
 * 将两个选项对象合并为一个新的
 * @return {[type]} [description]
 */
export function mergeOptions(parent, child, vm) {
    var options = {}
    var key

    for (key in parent) {
        mergeField(key)
    }

    function mergeField(key) {
        var strat = strats[key] || defaultStrat
        options[key] = strat(parent[key], child[key], vm, key)
    }

    return options
}