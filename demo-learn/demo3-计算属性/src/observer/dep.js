import {
    toArray
}
from '../util/index'

let uid = 0


/**
 * dep 是一个可观察量
 * 可以被多个指定订阅
 */
export default function Dep() {
    this.id = uid++
    this.subs = []
}


/**
 * 自我作为一个依赖项添加到目标watcher
 */
Dep.prototype.depend = function() {
    /**
     *  Dep.target = this;
     *  this = new Watcher()
     *  this.addDep
     */
    Dep.target.addDep(this)
}


/**
 * 添加一个指令订阅者
 * @param {Directive} sub => watcher对象
 */

Dep.prototype.addSub = function(sub) {
    this.subs.push(sub);
};



/**
 * 更新
 * 通知所有用户的一个新值。
 * @return {[type]} [description]
 */
Dep.prototype.notify = function() {
    //subs就是watcher对象的合集
    var subs = toArray(this.subs);
    for (var i = 0, l = subs.length; i < l; i++) {
        //watcher.update
        subs[i].update();
    }
};
