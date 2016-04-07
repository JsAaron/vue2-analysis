import { def, indexOf } from '../util/index'
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

/**
 * 拦截数组的方法
 * 重写并且触发事件
 */
;
[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]
.forEach(function(method) {
    //缓存原型方法
    var original = arrayProto[method]
    
    //方法拦截
    def(arrayMethods, method, function mutator() {
        //获取参数
        //并且转化真正数组
        var i = arguments.length
        var args = new Array(i)
        while (i--) {
            args[i] = arguments[i]
        }
        //通过call调用数组方法还原
        //this =>调用的数组
        var result = original.apply(this, args)
        console.log(this.__ob__)
        return result
    })
  

})

