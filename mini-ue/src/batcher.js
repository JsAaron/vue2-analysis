/**
 * watcher批量处理器
 *
 * 有两个分开的队列
 * 一个用于指令directive更新
 * 一个是用来给用户注册的$watch()
 * 
 */

var queue = []
var has = {}


/**
 * 增加一个watcher对象到这个watcher队列
 * @param  {[type]} watcher [description]
 * @return {[type]}         [description]
 */
export function pushWatcher(watcher) {

    var id = watcher.id;

    if (has[id] == null) {
        var q = queue
        has[id] = q.length
        //指令队列
        q.push(watcher)
        nextTick(flushBatcherQueue)
    }

}
