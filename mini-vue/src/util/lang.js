
var hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * 检查对象上是否有指定的属性
 * @param {Object} obj
 * @param {String} key
 * @return {Boolean}
 */
export function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}



export function _toString(value) {
    return value == null ? '' : value.toString()
}


/**
 * 混入属性合并
 * @param  {[type]} to   [description]
 * @param  {[type]} from [description]
 * @return {[type]}      [description]
 */
export function extend(to, from) {
    var keys = Object.keys(from)
    var i = keys.length
    while (i--) {
        to[keys[i]] = from[keys[i]]
    }
    return to
}


