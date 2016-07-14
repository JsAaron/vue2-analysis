import {
    nextTick,
} from './util/index'


var queue = [];
var userQueue = [];
var has = {};
var circular = {};
var waiting = false;


function resetBatcherState() {
    queue.length = 0;
    userQueue.length = 0;
    has = {};
    circular = {};
    waiting = false;
}


function runBatcherQueue(queue) {
    for (var i = 0; i < queue.length; i++) {
        var watcher = queue[i];
        var id = watcher.id;
        has[id] = null;
        watcher.run();
    }
    queue.length = 0;
}


function flushBatcherQueue() {
    var _again = true;

    _function: while (_again) {
        _again = false;
        runBatcherQueue(queue);
        runBatcherQueue(userQueue);
        if (queue.length) {
            _again = true;
            continue _function;
        }
        resetBatcherState();
    }
}


export function pushWatcher(watcher) {
    const id = watcher.id
    if (has[id] == null) {
        var q = queue;
        has[id] = q.length;
        q.push(watcher);
        if (!waiting) {
            waiting = true;
            nextTick(flushBatcherQueue);
        }
    }
}
