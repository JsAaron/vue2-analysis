/**
 * 指令
 *  v-on
 *  v-text
 */
import directives from './directives/index'

/**
 * Ue构造器
 * @param {[type]} options [description]
 */
class Ue {

    constructor(options) {
        this._init(options)
    }

    _init(options) {
        options = options || {}
        this.$el = null;


        //初始化空数据
        //通过_initScope方法填充
        this._data = {};
        this._initState()

	    //所有指令合集
	    this._directives = [];
	    //所有观察对象
	    this._watchers = [];

	    //el存在,开始编译
	    if (options.el) {
	        this.$mount(options.el);
	    }
        console.log("####", this)
    }

    _initState(){

    }

    $mount(el){
	    el =document.querySelector(el);
	    this._compile(el);
    }

    /**
     * 开始编译
     * @param  {[type]} el [description]
     * @return {[type]}    [description]
     */
    _compile(el){

    }


}


/**
 * Ue构造器扩展
 * 编译步骤,调用this.constructor.options”。
 * @type {Object}
 */
Ue.options = {
    //指令
    directives
}


export default Ue

window.Ue = Ue;
