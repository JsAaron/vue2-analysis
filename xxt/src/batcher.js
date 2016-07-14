import {
    nextTick,
} from './util/index'

// we have two separate queues: one for directive updates
// and one for user watcher registered via $watch().
// we want to guarantee directive updates to be called
// before user watchers so that when user watchers are
// triggered, the DOM would have already been in updated
// state.

var queue = []
var userQueue = []
var has = {}
var circular = {}
var waiting = false

/**
 * Reset the batcher's state.
 */

function resetBatcherState() {
    queue.length = 0
    userQueue.length = 0
    has = {}
    circular = {}
    waiting = false
}

/**
 * Flush both queues and run the watchers.
 */

function flushBatcherQueue() {
    runBatcherQueue(queue)
    runBatcherQueue(userQueue)
        // user watchers triggered more watchers,
        // keep flushing until it depletes
    if (queue.length) {
        return flushBatcherQueue()
    }

    resetBatcherState()
}

/**
 * Run the watchers in a single queue.
 *
 * @param {Array} queue
 */

function runBatcherQueue(queue) {
    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (let i = 0; i < queue.length; i++) {
        var watcher = queue[i]
        var id = watcher.id
        has[id] = null
        watcher.run()
    }
    queue.length = 0
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 *
 * @param {Watcher} watcher
 *   properties:
 *   - {Number} id
 *   - {Function} run
 */

export function pushWatcher(watcher) {
    const id = watcher.id
    if (has[id] == null) {
        // push watcher into appropriate queue
        const q = watcher.user ? userQueue : queue
        has[id] = q.length
        q.push(watcher)
            // queue the flush
        if (!waiting) {
            waiting = true
            nextTick(flushBatcherQueue)
        }
    }
}