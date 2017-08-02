import Mue from './instance/index'
import {
  initGlobalAPI
} from './global-api/index'
// import { isServerRendering } from 'core/util/env'

initGlobalAPI(Mue)

export default Mue

/**

div => attrs => id.editor
	p => v(_s(answer))
	_v(" ")
	textarea => domProps=> value:input
			 => on => input:update
	_v(" ")
	div => domProps => innerHTML:_s(compiledMarkdown)


	with(this) {
		return _c('div', {
			attrs: { "id": "editor" }
		}, [
			_c('p', [_v(_s(answer))]),
			_v(" "),
			_c('textarea', {
				domProps: {"value": input},
				on: {"input": update}}),
			_v(" "),
			_c('div', {domProps: {"innerHTML": _s(compiledMarkdown)}
		})])
	}
=