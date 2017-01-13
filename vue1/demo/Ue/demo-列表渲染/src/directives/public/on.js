import {
    on, off, warn
}
from '../../util/index'

export default {
    test: 'on',

    acceptStatement: true,

    bind: function() {

    },
    update: function(handler) {
        this.handler = handler;
        on(this.el, this.arg, function(e){
        	handler(e)
        }, 'fasle');
    }
}
 