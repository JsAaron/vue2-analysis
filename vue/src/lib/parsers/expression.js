import {
    warn
}
from '../util/index'

//简单字符表达式
const pathTestRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/
const booleanLiteralRE = /^(?:true|false)$/

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
    var res = {
            exp: exp
        }
        //简单表达式getter
    res.get = makeGetterFn('scope.' + exp)
    return res
}



/**
 * 检测是一个简单是路径表达式
 * 比如: 
 *    1 v-on:show() 错误
 *    2 v-on:show 正确
 * @param  {[type]}  exp [description]
 * @return {Boolean}     [description]
 */
export function isSimplePath(exp) {
    return pathTestRE.test(exp) &&
        // don't treat true/false as paths
        !booleanLiteralRE.test(exp) &&
        // Math constants e.g. Math.PI, Math.E etc.
        exp.slice(0, 5) !== 'Math.'
}