import Mue from './runtime/index'
import { query } from './util/index'

var mount = Mue.prototype.$mount;
Mue.prototype.$mount = function(el, hydrating) {
  el = el && query(el);

  console.log(el)
};



window.Mue = Mue

export default Mue