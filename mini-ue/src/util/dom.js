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