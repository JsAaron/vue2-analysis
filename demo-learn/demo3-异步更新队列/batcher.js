function Watcher(id) {
    this.id = id
}
Watcher.prototype.run = function(){
	console.log(this.id,'调用指令的更新update方法')
}


/**
 * 延时任务到异步执行
 * 利用MutationObserver
 * 否则用setTimeout
 * @param  {Array}  ) {              
 * @return {[type]}   [description]
 */
var nextTick = (function() {
    var callbacks = []
    var pending = false
    var timerFunc

    function nextTickHandler() {
        pending = false
        var copies = callbacks.slice(0)
        callbacks = []
        for (var i = 0; i < copies.length; i++) {
            copies[i]()
        }
    }

    if (typeof MutationObserver !== 'undefined') {
        var counter = 1
        var observer = new MutationObserver(nextTickHandler)
        var textNode = document.createTextNode(counter)

        observer.observe(textNode, {
            //节点内容或节点文本的变动
            characterData: true
        })
        timerFunc = function() {
            counter = (counter + 1) % 2
            textNode.data = counter
        }
    } else {
        timerFunc = window.setImmediate || setTimeout
    }
    return function(cb) {
        callbacks.push(cb)
        if (pending) return
        pending = true
        timerFunc(nextTickHandler, 0)
    }
})()



//dom更新队列
var queue = [];
//不重复创建nextTick
var waiting = false;
//去重
var has ={};

function flushBatcherQueue() {
    runBatcherQueue(queue);
}

/**
 * 运行watcher对象
 * 更新
 * @param  {[type]} queue [description]
 * @return {[type]}       [description]
 */
function runBatcherQueue(queue) {
    for (queueIndex = 0; queueIndex < queue.length; queueIndex++) {
        var watcher = queue[queueIndex];
        var id = watcher.id;
        has[id] = null;
        watcher.run();
    }
}

/**
 * 将watcher对象加入更新队列
 * @return {[type]} [description]
 */
function pushWatcher(watcher) {
    var id = watcher.id;
    if (has[id] == null) {
        has[id] = queue.length;
        queue.push(watcher);
        if (!waiting) {
            waiting = true;
            //通过异步收集更新watcher对象
            nextTick(flushBatcherQueue);
        }
    }
}


pushWatcher(new Watcher(1))
pushWatcher(new Watcher(2))
