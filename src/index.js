// http://stackoverflow.com/a/7445863

/**
 * @param {Function} action interval callback that may return a different duration for the next tick
 * @param {Object|Number} [config] initial configuration object / context. ex: { wait: 50, immediate: false }
 * @param {Object} [api] custom interval API (defaults to `window.setTimeout` and `window.clearTimeout`)
 * @returns {Object}
 */
export function setDynterval (action, config = { }, api = { setTimeout, clearTimeout, setInterval, clearInterval }) {
  if (!action || !(action instanceof Function)) {
    throw TypeError('Interval callback must be a function')
  }

  if (!api ||
     (!(api.setTimeout    instanceof Function) ||
      !(api.clearTimeout  instanceof Function)) &&
     (!(api.setInterval   instanceof Function) ||
      !(api.clearInterval instanceof Function))) {
    throw Error('Custom interval APIs must define either `setTimeout` and `clearTimeout` OR `setInterval` and `clearInterval` functions')
  }

  if (config.constructor === Number) {
    config = { wait: config }
  }

  let interval
  let context = Object.assign({ wait: 0 }, config)

  const next  = api.setTimeout   || api.setInterval
  const clear = api.clearTimeout || api.clearInterval

  const step = () => {
    if (interval) clear(interval)

    context  = action(context) || context
    interval = next(step, context.wait)
  }

  if (!config.immediate) {
    interval = next(step, config.wait)
  } else {
    step()
  }

  return {
    get current () {
      return interval
    },

    get context () {
      return context
    },

    set context (value) {
      context = value
    },

    clear () {
      setTimeout(() => clear(interval), 0)
    }
  }
}

export default setDynterval
