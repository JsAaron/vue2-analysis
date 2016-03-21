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

