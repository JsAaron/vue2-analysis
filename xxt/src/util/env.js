let _Set
    /* istanbul ignore if */
if (typeof Set !== 'undefined' && Set.toString().match(/native code/)) {
    // use native Set when available.
    _Set = Set
} else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = function() {
        this.set = Object.create(null)
    }
    _Set.prototype.has = function(key) {
        return this.set[key] !== undefined
    }
    _Set.prototype.add = function(key) {
        this.set[key] = 1
    }
    _Set.prototype.clear = function() {
        this.set = Object.create(null)
    }
}

export {
    _Set
}