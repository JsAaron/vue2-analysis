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