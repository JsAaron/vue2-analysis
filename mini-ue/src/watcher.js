import {
    extend,
    warn
} from './util/index'

import { parseExpression } from './parsers/expression'

let uid = 0

/**
 * watcher用来解析表达式
 * 收集依赖关系
 * 当表达式的值被改变触发callback回调函数
 * 给api或者指令 使用$watch()方法
 * @param {[type]}   vm      [description]
 * @param {[type]}   expOrFn [description]
 * @param {Function} cb      [description]
 * @param {[type]}   options [description]
 */
export default function Watcher(vm, expOrFn, cb, options) {
    //混入参数
    if (options) {
        extend(this, options)
    }

    //表达式是不是函数
    var isFn = typeof expOrFn === 'function';

    this.vm = vm;
    //加入this的观察数组
    vm._watchers.push(this);

    this.expression = expOrFn;
    this.cb = cb;

    //定义一个标示
    this.id = ++uid

    this.newDeps = [];

    //解析表达式
    //得到setter/getter
    var res = parseExpression(expOrFn, this.twoWay);
    this.getter = res.get;
    this.setter = res.set;


    //获取值
    this.value = this.get();

    console.log(isFn)
}


Watcher.prototype.get = function() {
    this.beforeGet()
    var scope = this.scope || this.vm
    var value
    try {
        value = this.getter.call(scope, scope)
    } catch (e) {
        if (
            process.env.NODE_ENV !== 'production' &&
            config.warnExpressionErrors
        ) {
            warn(
                'Error when evaluating expression "' +
                this.expression + '". ' +
                (config.debug ? '' : 'Turn on debug mode to see stack trace.'), e
            )
        }
    }
}
 

/**
 * 准备收集依赖
 * @return {[type]} [description]
 */
Watcher.prototype.beforeGet = function() {
    this.newDepIds = Object.create(null);
    this.newDeps.length = 0;
};
