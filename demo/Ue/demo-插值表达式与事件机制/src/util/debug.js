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
