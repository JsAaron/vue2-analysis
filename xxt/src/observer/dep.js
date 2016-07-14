let uid = 0;



function toArray(list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
        ret[i] = list[i + start];
    }
    return ret;
}

/**
 * dep是一种观察可以被多个指令订阅它
 */
export default function Dep() {
    this.id = uid++;
    this.subs = []
}

Dep.target = null


Dep.prototype.addSub = function(sub) {
    this.subs.push(sub);
}

/**
 *  Dep.target is a wather object through Wacther class to build
 */
Dep.prototype.depend = function() {
    Dep.target.addDep(this);
};


Dep.prototype.notify = function() {
    var subs = toArray(this.subs);
    for (var i = 0, l = subs.length; i < l; i++) {
        subs[i].update();
    }
}