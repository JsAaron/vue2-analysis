/**
 * 给每一个观察的数据组设置观察
 * @param {[type]} value [description]
 */
function Observer(value) {
    this.value = value;
    this.dep = new Dep();
    //给value中定义一个__ob__引用父对应this
    def(value, '__ob__', this);
    //建议数据观察
    this.walk(value);
}

/**
 * 如果obj是多个对象
 * 分开转化
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
Observer.prototype.walk = function(obj) {
    var keys = Object.keys(obj);
    for (var i = 0, l = keys.length; i < l; i++) {
        this.convert(keys[i], obj[keys[i]]);
    }
};


Observer.prototype.convert = function(key, val) {
    defineReactive(this.value, key, val);
};


/**
 * 建议数据的观察
 * setter/getter
 * 建立单数的响应
 * @param  {[type]} obj [description]
 * @param  {[type]} key [description]
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
function defineReactive(obj, key, val) {
    var dep = new Dep();

    //继续分解val
    //因为val可能还是数组或者对象额结构
    var childOb = observe(val);

	Object.defineProperty(obj, key, {
		enumerable:true,
		configurable:true,
		set:function(newVal){
			console.log(newVal)
		},
		get:function(){

		}
	})
}


function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
}


var uid = 0;

function Dep() {
    this.uid = uid++;
    //收集wathcher
    this.sub = []
}


function observe(value) {

	if (!value || typeof value !== "object") {
		return;
	}

    var ob = new Observer(value);
    return ob;
}
