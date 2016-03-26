import {toArray} from '../util/index'

let uid = 0


/**
 * dep 是一个可观察量
 * 可以被多个指定订阅
 */
export default function Dep () {
  this.id = uid++
  this.subs = []
}


/**
 * 自我作为一个依赖项添加到目标watcher
 */
Dep.prototype.depend = function () {
/**
 *  Dep.target = this;
 *  this = new Watcher()
 *  this.addDep
 */
  Dep.target.addDep(this)
}


/**
 * 添加一个指令订阅者
 * @param {Directive} sub
 */

Dep.prototype.addSub = function(sub) {
    this.subs.push(sub);
};

