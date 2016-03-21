
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



export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}


//是一个真实的对象
//通过call prototype  == [object object]
var toString = Object.prototype.toString
var OBJECT_STRING = '[object Object]'
export function isPlainObject (obj) {
  return toString.call(obj) === OBJECT_STRING
}

export function _toString(value) {
    return value == null ? '' : value.toString()
}


/**
 * 数组检测
 *
 * @param {*} obj
 * @return {Boolean}
 */
export const isArray = Array.isArray


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


