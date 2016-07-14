function on(el, event, cb, useCapture) {
    el.addEventListener(event, cb, useCapture);
}

export default {

    priority: 700,
    bind() {

    },

    update(handler) {
        this.handler = handler;
        on(this.el, this.arg, this.handler, false)
    },

    unbind() {

    }
}