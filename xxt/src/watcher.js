import Dep from './observer/dep'
import {
    pushWatcher
} from './batcher'
import {
    _Set as Set
} from './util/index'

let uid = 0

function makeGetterFn(body) {
    try {
        /* eslint-disable no-new-func */
        return new Function('scope', 'return ' + body + ';');
        /* eslint-enable no-new-func */
    } catch (e) {
        console.log('makeGetterFn is error')
    }
}


function parseExpression(exp, needSet) {
    exp = exp.trim()
    var res = {
        exp: exp
    };
    res.get = makeGetterFn('scope.' + exp)
    return res;
}


export function Watcher(vm, expOrFn, cb) {

    var isFn = typeof expOrFn === 'function';
    this.vm = vm;
    vm._watchers.push(this);
    this.expression = expOrFn;
    this.cb = cb;

    this.id = ++uid // uid for batching

    this.newDeps = []
    this.newDepIds = new Set()

    this.deps = []
    this.depIds = new Set()

    if (isFn) {

    } else {
        var res = parseExpression(expOrFn)
        this.getter = res.get
        this.setter = res.set
    }

    this.value = this.get();
}


Watcher.prototype.beforeGet = function() {
    Dep.target = this;
};

Watcher.prototype.get = function() {
    this.beforeGet();
    var scope = this.scope || this.vm;
    var value;

    try {
        value = this.getter.call(scope, scope);
    } catch (e) {

    }

    this.afterGet();

    return value
};


Watcher.prototype.afterGet = function() {
    Dep.target = null;
    var i = this.deps.length;
    while (i--) {
        var dep = this.deps[i];
        if (!this.newDepIds.has(dep.id)) {
            dep.removeSub(this);
        }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
};


/**
 * 收集defineReactive产生的dep依赖
 * 然后对一个把wahter对象push到dep对象中
 * 相互push 真TMD绕
 */
Watcher.prototype.addDep = function(dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
        this.newDepIds.add(id);
        this.newDeps.push(dep);
        if (!this.depIds.has(id)) {
            dep.addSub(this);
        }
    }
};



/**
 * Prepare for dependency collection.
 */

Watcher.prototype.beforeGet = function() {
    Dep.target = this
}

/**
 * Add a dependency to this directive.
 *
 * @param {Dep} dep
 */

Watcher.prototype.addDep = function(dep) {
    var id = dep.id
    if (!this.newDepIds.has(id)) {
        this.newDepIds.add(id)
        this.newDeps.push(dep)
        if (!this.depIds.has(id)) {
            dep.addSub(this)
        }
    }
}

/**
 * Clean up for dependency collection.
 */

Watcher.prototype.afterGet = function() {
    Dep.target = null
    var i = this.deps.length
    while (i--) {
        var dep = this.deps[i]
        if (!this.newDepIds.has(dep.id)) {
            dep.removeSub(this)
        }
    }
    var tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
}

/**
 * Depend on all deps collected by this watcher.
 */

Watcher.prototype.depend = function() {
    var i = this.deps.length
    while (i--) {
        this.deps[i].depend()
    }
}


Watcher.prototype.update = function (shallow) {
    this.queued = true
    pushWatcher(this)
  
}