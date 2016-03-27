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



/**
 * 绑定shij
 *
 * @param {Element} el
 * @param {String} event
 * @param {Function} cb
 * @param {Boolean} [useCapture]
 */

export function on (el, event, cb, useCapture) {
  el.addEventListener(event, cb, useCapture)
}

/**
 * 销毁事件
 *
 * @param {Element} el
 * @param {String} event
 * @param {Function} cb
 */

export function off (el, event, cb) {
  el.removeEventListener(event, cb)
}


/**
 * 通过el替换target节点
 *
 * @param {Element} target
 * @param {Element} el
 */

export function replace (target, el) {
  var parent = target.parentNode
  if (parent) {
    parent.replaceChild(el, target)
  }
}