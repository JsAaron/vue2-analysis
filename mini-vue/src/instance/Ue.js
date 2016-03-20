/**
 * Ue构造器
 * @param {[type]} options [description]
 */
function Ue(options) {
    this._init(options)
}



Vue.prototype._init = function(options) {
    options = options || {}
    this.$el = null;
    //初始化空数据
    //通过_initScope方法填充
    this._data = {}

    this._initState()
}


Object.defineProperty(Vue.prototype, '$data', {
    get: function() { 
        return this._data
    },
    set: function(newData) {
        if (newData !== this._data) {
            this._setData(newData)
        }
    }
})




export default Ue
 