import { initMixin } from './init'
import { stateMixin } from './state'

function Mue(options) {
  this._init(options)
}

initMixin(Mue)
stateMixin(Mue)

export default Mue