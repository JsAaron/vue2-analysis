import Watcher from './watcher'
import {
    extend
}
from './util/index'

import {
    parseExpression,
    isSimplePath
}
from './parsers/expression'

function noop() {}

/**
 * [Directive description]
 * @param {[type]} descriptor [信息描述]
 * @param {[type]} vm         [description]
 * @param {[type]} el         [description]
 * @param {[type]} host       [description]
 * @param {[type]} scope      [description]
 * @param {[type]} frag       [description]
 */
export default function Directive(descriptor, vm, el, host, scope, frag) {
    this.vm = vm;
    this.el = el;
    this.descriptor = descriptor;
    this.name = descriptor.name;
    //事件name
    this.arg = descriptor.arg;
    this.expression = descriptor.expression;
}



/**
 * 初始化指令
 * 定义混入的属性
 * 安装watcher
 * 调用定义的bind与update
 * @return {[type]} [description]
 */
Directive.prototype._bind = function() {

    var name = this.name;
    var descriptor = this.descriptor;

    // console.log(descriptor)

    //移除定义的属性
    //v-on: ....
    if (this.el && this.el.removeAttribute) {
        var attr = descriptor.attr || 'v-' + name;
        this.el.removeAttribute(attr);
    }

    //复制def属性 
    var def = descriptor.def
    if (typeof def === 'function') {
        console.log('def function')
    } else {
        //拷贝指定定义的接口
        extend(this, def)
    }

    //初始化bind方法 
    if (this.bind) {
        this.bind();
    }

    //如果是表达式
    //并且有更新函数
    //并且表达式不是函数
    if (this.expression && this.update && !this._checkStatement()) {

        // console.log(this)
        //textl类型处理
        //给上下文对象包装更新方法
        var dir = this;
        if (this.update) {
            this._update = function(val, oldVal) {
                if (!dir._locked) {
                    dir.update(val, oldVal);
                }
            };
        } else {
            this._update = noop;
        }

        var preProcess = this._preProcess ? bind(this._preProcess, this) : null
        var postProcess = this._postProcess ? bind(this._postProcess, this) : null
        var watcher = this._watcher = new Watcher(
            this.vm,
            this.expression,
            this._update, // callback
            {
                filters: this.filters,
                twoWay: this.twoWay,
                deep: this.deep,
                preProcess: preProcess,
                postProcess: postProcess,
                scope: this._scope
            }
        );

        //更新值
        if (this.update) {
            this.update(watcher.value);
        }

    }


}


/**
 * 检查指令是否是函数调用
 * 并且如果表达式是一个可以调用
 * 如果两者都满足
 * 将要包装表达式，并且作为事件处理句柄
 *
 * 例如： on-click="a++"
 *
 * on 指令
 *     acceptStatement：true
 * 
 * @return {Boolean}
 */

Directive.prototype._checkStatement = function() {
    var expression = this.expression;

    if (expression && this.acceptStatement && !isSimplePath(expression)) {
        //生成求值方法
        var fn = parseExpression(expression).get;

        var scope = this.vm;

        //事件回调
        var handler = function handler(e) {
            scope.$event = e;
            fn.call(scope, scope);
            scope.$event = null;
        };

        //绑定事件
        this.update(handler);

        return true;
    }
};
