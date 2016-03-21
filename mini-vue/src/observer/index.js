import {
    hasOwn,
    isArray,
    isPlainObject,
} from '../util/index'


export function Observer(value) {
	this.value = value
}

/**
 * 为实例的value创建观察observer
 * 成功：返回一个新的observer
 * 或者返回已经存在的observer对象
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
export function observe(value, vm) {
    //必须是对象
    if (!value || typeof value !== 'object') {
        return
    }
    var ob;
    //如果存在
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
        //数组
        //对象
        //可以被扩展
    } else if ((isArray(value) || isPlainObject(value)) && Object.isExtensible(value)) {
        ob = new Observer(value);
    }
}