import Mue from './instance/index'
import { initGlobalAPI } from './global-api/index'
// import { isServerRendering } from 'core/util/env'

initGlobalAPI(Mue)


// console.dir(Mue)
window.Mue = Mue
