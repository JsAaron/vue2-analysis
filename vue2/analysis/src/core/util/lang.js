/**
 * 定义一个属性
 */
export function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}


/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
export function parsePath(path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function(obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}