import Dep from './observer/dep'
import {
    pushWatcher
}
from './batcher'
import {
    extend,
    warn
}
from './util/index'
import {
    parseExpression
}
from './parsers/expression'

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

    //dep列表
    this.deps = []

    this.depIds = Object.create(null)
    this.newDeps = [];
    this.newDepIds = null

    //解析表达式
    //得到setter/getter
    var res = parseExpression(expOrFn, this.twoWay);
    this.getter = res.get;
    this.setter = res.set;


    //获取值
    this.value = this.get();

}


Watcher.prototype.get = function() {
    this.beforeGet()
    var scope = this.scope || this.vm
    var value
    try {
        value = this.getter.call(scope, scope)
    } catch (e) {
        if (
            process.env.NODE_ENV !== 'production'
        ) {
            warn(
                'Error when evaluating expression "' +
                this.expression
            )
        }
    }
    this.afterGet();
    return value;
}


/**
 * 准备收集依赖
 * @return {[type]} [description]
 */
Watcher.prototype.beforeGet = function() {
    /**
     * 暴露出观察对象
     * @type {[type]}
     */
    Dep.target = this;
    this.newDepIds = Object.create(null);
    this.newDeps.length = 0;
};


/**
 * 清理依赖收集
 */

Watcher.prototype.afterGet = function() {
    Dep.target = null;
    var i = this.deps.length;
    while (i--) {
        var dep = this.deps[i];
        if (!this.newDepIds[dep.id]) {
            dep.removeSub(this);
        }
    }
    //重新赋予依赖值
    this.depIds = this.newDepIds;
    var tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
};


/**
 * 给这个指令增加一个依赖
 * Dep.target.addDep(this)
 *
 * value 
 *   =>getter
 *   =>Dep.target
 *   =>dep.depend
 * @param {Dep} dep
 */
Watcher.prototype.addDep = function(dep) {
    var id = dep.id;
    if (!this.newDepIds[id]) {
        this.newDepIds[id] = true;
        this.newDeps.push(dep);
        if (!this.depIds[id]) {
            dep.addSub(this);
        }
    }
};


/**
 * 订阅接口
 * 当依赖被改变时候调用
 * _data setter = >调用
 * @param  {[type]} shallow [description]
 * @return {[type]}         [description]
 */
Watcher.prototype.update = function(shallow) {
    //加入water列表
    pushWatcher(this);
};
