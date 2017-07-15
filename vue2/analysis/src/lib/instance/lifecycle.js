
export function initLifecycle (mve) {
  const options = mve.$options

  mve.$parent = parent
  mve.$root = parent ? parent.$root : mve

  mve.$children = []
  mve.$refs = {}

  mve._watcher = null
  mve._inactive = null
  mve._directInactive = false
  mve._isMounted = false
  mve._isDestroyed = false
  mve._isBeingDestroyed = false
}
