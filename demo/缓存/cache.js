/**
 * https://github.com/rsms/js-lru
 */

/**
 * limit 限定缓存数据的大小 
 * @param {[type]} limit [description]
 */
function Cache(limit) {
    this.size = 0
    this.limit = limit
    this.head = this.tail = undefined
    this._keymap = Object.create(null)
    console.log(this)
}

var p = Cache.prototype


p.put = function(key, value) {
    var removed
    //如果溢出最大限定
    if (this.size === this.limit) {
        removed = this.shift()
    }

    //查询是否已经存在
    var entry = this.get(key, true)
    if (!entry) {
        entry = {
            key: key
        }
        //保存
        this._keymap[key] = entry

        if (this.tail) {
            this.tail.newer = entry
            entry.older = this.tail
        } else {
            this.head = entry
        }
        this.tail = entry
        this.size++
    }
    entry.value = value

    return removed
}


p.shift = function() {
	//取出第一个数据
    var entry = this.head
    if (entry) {
        this.head = this.head.newer
        this.head.older = undefined
        entry.newer = entry.older = undefined
        this._keymap[entry.key] = undefined
        this.size--
    }
    return entry
}


p.get = function(key, returnEntry) {

	//获取缓存中的数据
    var entry = this._keymap[key]
    if (entry === undefined) return


    if (entry === this.tail) {
        return returnEntry ? entry : entry.value
    }
    // HEAD--------------TAIL
    //   <.older   .newer>
    //  <--- add direction --
    //   A  B  C  <D>  E
    if (entry.newer) {
        if (entry === this.head) {
            this.head = entry.newer
        }
        entry.newer.older = entry.older // C <-- E.
    }
    if (entry.older) {
        entry.older.newer = entry.newer // C. --> E
    }
    entry.newer = undefined // D --x
    entry.older = this.tail // D. --> E
    if (this.tail) {
        this.tail.newer = entry // E. <-- D
    }
    this.tail = entry
    return returnEntry ? entry : entry.value
}
