import {
    nextTick
}
from './util/index'


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
var queueIndex


/**
 * 冲洗两个队列和运行观察对象
 */
function flushBatcherQueue() {
    runBatcherQueue(queue)
}



/**
 * 在单个队列中运行watchers
 * @param {Array} queue
 * queue 
 *   watcher对象合集
 */

function runBatcherQueue(queue) {
    for (queueIndex = 0; queueIndex < queue.length; queueIndex++) {
        var watcher = queue[queueIndex]
        var id = watcher.id
        //清空标记
        has[id] = null
        watcher.run()
            // in dev build, check and stop circular updates.
        if (process.env.NODE_ENV !== 'production' && has[id] != null) {
            circular[id] = (circular[id] || 0) + 1
            if (circular[id] > config._maxUpdateCount) {
                queue.splice(has[id], 1)
                warn(
                    'You may have an infinite update loop for watcher ' +
                    'with expression: ' + watcher.expression
                )
            }
        }
    }
}



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
            //更新动作
        nextTick(flushBatcherQueue)
    }

}
