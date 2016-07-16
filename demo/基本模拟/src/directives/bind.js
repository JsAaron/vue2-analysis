  function on(el, event, cb, useCapture) {
      el.addEventListener(event, cb, useCapture);
  }

  export default {

      bind() {

          },

          update(handler) {
              console.log(11)
              this.handler = handler;
              console.log(this.el, this.arg)
              on(this.el, this.arg, function() {
                  this.handler
                  alert(1)
              }, this.modifiers.capture);
          },

          unbind() {

          }
  }