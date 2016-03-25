import {
    warn
}
from 'util/index'

/**
 * 建立一个getter函数。需要eval。
 * @param  {[type]} body [description]
 * @return {[type]}      [description]
 */
function makeGetterFn(body) {
    try {
        return new Function('scope', 'return ' + body + ';')
    } catch (e) {
        process.env.NODE_ENV !== 'production' && warn(
            'Invalid expression. ' +
            'Generated function body: ' + body
        )
    }
}


/**
 * 解析表达式
 * 重写setter/getter
 * @param  {[type]} exp     [description]
 * @param  {[type]} needSet [description]
 * @return {[type]}         [description]
 */
export function parseExpression(exp, needSet) {
    exp = exp.trim()
    var res = { exp: exp }
    //简单表达式getter
    res.get = makeGetterFn('scope.' + exp)
    return res
}



/**
 * 检测是一个简单是表达式
 * @param  {[type]}  exp [description]
 * @return {Boolean}     [description]
 */
export function isSimplePath(exp) {

}
