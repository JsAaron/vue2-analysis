export function pushWatcher(watcher) {
    const id = watcher.id
    console.log(id)
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