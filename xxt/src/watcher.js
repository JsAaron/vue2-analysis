export function Watcher(vm, expOrFn, cb) {

    this.vm = vm;
    vm._watchers.push(this);
    this.expression = expOrFn;
    this.cb = cb;

    
}