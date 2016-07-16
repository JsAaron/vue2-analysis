import {
    Watcher
}
from './watcher'

function extend(to, from) {

    var keys = Object.keys(from);
    var i = keys.length;
    while (i--) {
        to[keys[i]] = from[keys[i]];
    }
    return to;
}

export function Directive(descriptor, vm, el) {
    this.vm = vm
    this.el = el

    this.descriptor = descriptor
    this.name = descriptor.name
    this.expression = descriptor.expression
    this.arg = descriptor.arg

    this._locked = false
    this._bound = false
    this._listeners = null
}

Directive.prototype._bind = function() {

    var name = this.name;
    var descriptor = this.descriptor;
    var def = descriptor.def;

    extend(this, def);

    if (this.bind) {
        this.bind();
    }

    var dir = this;
    this._update = function(val, oldVal) {
        if (!dir._locked) {
            dir.update(val, oldVal);
        }
    }

    var watcher = new Watcher(this.vm, this.expression, this._update)

    this._watcher = watcher

    if (this.update) {
        this.update(watcher.value);
    }

}
