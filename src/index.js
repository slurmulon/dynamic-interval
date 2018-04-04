// http://stackoverflow.com/a/7445863

/**
 * @param {Function} action interval callback that may return a different duration for the next tick
 * @param {Object|Number} [config] initial configuration object / context. ex: { wait: 50, immediate: false }
 * @param {Object} [api] custom interval API (defaults to `window.setInterval` and `window.clearInterval`)
 * @returns {Object}
 */
export function setDynterval (action, config = {}, api = { setInterval, clearInterval }) {
  if (!action || !(action instanceof Function)) {
    throw Error('Interval callback must be a function')
  }

  if (!api || !(api.setInterval instanceof Function) || !(api.clearInterval instanceof Function)) {
    throw Error('Custom interval APIs must define both `setInterval` and `clearInterval` functions')
  }

  if (config.constructor === Number) {
    config = { wait: config }
  }

  let context = Object.assign({ wait: 0 }, config)

  const step = () => {
    if (interval) api.clearInterval(interval)

    context  = action(context) || context
    interval = api.setInterval(step, context.wait)
  }

  if (config.immediate) step()

  let interval = api.setInterval(step.bind(this), context.wait)

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
      setTimeout(() => api.clearInterval(interval), 0)
      // api.clearInterval(interval)
    }
  }
}

export default setDynterval
