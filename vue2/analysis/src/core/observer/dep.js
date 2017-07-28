let uid = 0

export default function Dep() {
  this.id = uid++;
  this.subs = [];
}


Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};


/**
 * 把对应的watcher对象加入到属性的dep中
 * 那么以为这属性更新对应的dep中的watcher就要跟着更新
 */
Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};


/**
 * 评估target
 * 全局唯一
 */
Dep.target = null;
var targetStack = [];

export function pushTarget(_target) {
  if (Dep.target) {
    targetStack.push(Dep.target);
  }
  Dep.target = _target;
}

export function popTarget() {
  Dep.target = targetStack.pop();
}