var hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * 检查对象上是否有指定的属性
 * @param {Object} obj
 * @param {String} key
 * @return {Boolean}
 */
export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key)
}


  
export function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}


//是一个真实的对象
//通过call prototype  == [object object]
var toString = Object.prototype.toString
var OBJECT_STRING = '[object Object]'
export function isPlainObject(obj) {
    return toString.call(obj) === OBJECT_STRING
}

export function _toString(value) {
    return value == null ? '' : value.toString()
}


/**
 * 数组化
 * 转化一个像数组的对象变成一个真实的数组
 * @param  {[type]} list  [description]
 * @param  {[type]} start [description]
 * @return {[type]}       [description]
 */
export function toArray(list, start) {
    start = start || 0
    var i = list.length - start
    var ret = new Array(i)
    while (i--) {
        ret[i] = list[i + start]
    }
    return ret
}


/**
 * 文本输出
 * 如果是null 返回空
 * 如果有值，通过toString强制转字符串
 * @param {*} value
 * @return {String}
 */

export function _toString (value) {
  return value == null
    ? ''
    : value.toString()
}


/**
 * 数组快速比较
 * 找到对应值的索引
 * @param  {[type]} arr [description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
export function indexOf (arr, obj) {
  var i = arr.length
  while (i--) {
    if (arr[i] === obj) return i
  }
  return -1
}


var camelizeRE = /-(\w)/g
export function camelize (str) {
  return str.replace(camelizeRE, toUpper)
}
function toUpper (_, c) {
  return c ? c.toUpperCase() : ''
}


/**
 * 定义一个属性
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 * @param {Boolean} [enumerable]
 */

export function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
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