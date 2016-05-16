//ul构造器
import Ue from './instance/Ue'
//实例扩展的一些api接口
import installGlobalAPI from './global-api'

installGlobalAPI(Ue)

Ue.version = 'undefined'

export default Ue

window.Ue = Ue;