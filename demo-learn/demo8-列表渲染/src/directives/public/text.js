import {
    _toString
}
from '../../util/index'

export default {

    test: 'text',

    bind: function() {
        this.attr = this.el.nodeType === 3 ? 'data' : 'textContent'
    },

    update: function(value) {
        this.el[this.attr] = _toString(value)
    }
}
