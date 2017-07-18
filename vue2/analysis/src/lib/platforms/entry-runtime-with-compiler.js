import Mue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'

var mount = Mue.prototype.$mount;
Mue.prototype.$mount = function(el, hydrating) {
  el = el && query(el);

  var options = this.$options
  var template = getOuterHTML(el);

  var ref = compileToFunctions(template, {
    shouldDecodeNewlines: false,
    delimiters: ''
  }, this);

};


function getOuterHTML(el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}



window.Mue = Mue

export default Mue