
export default {
    test: 'on',

    acceptStatement: true,

    bind: function() {

    },
    update: function(handler) {
        this.handler = handler;
        this.el.addEventListener(this.arg, this.handler, "fasle")
    }
}
 