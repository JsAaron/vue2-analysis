// import Watcher from './watcher'
import {
    extend
}
from './util/index'

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

    console.log(descriptor)

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

    var preProcess  = this._preProcess ? bind(this._preProcess, this) : null
    var postProcess = this._postProcess ? bind(this._postProcess, this) : null
    // var watcher = this._watcher = new Watcher(
    //     this.vm,
    //     this.expression,
    //     this._update, // callback
    //     {
    //         filters     : this.filters,
    //         twoWay      : this.twoWay,
    //         deep        : this.deep,
    //         preProcess  : preProcess,
    //         postProcess : postProcess,
    //         scope       : this._scope
    //     }
    // );

    // console.log(this)

}
