// http://stackoverflow.com/a/7445863

/**
 * @param {Function} next method that calculates and returns the interval gap for the next tick
 * @param {Object|Number} config initial configuration object / context. ex: { wait: 50, immediate: false }
 * @returns {Object}
 */
export function setDynterval (next, config = {}, api = { setInterval, clearInterval }) {
  if (!api || !api.setInterval instanceof Function || !api.clearInterval instanceof Function) {
    throw Error('Custom interval APIs must define both `setInterval` and `clearInterval` functions')
  }

  if (config.constructor === Number) {
    config = { wait: config }
  }

  let context = Object.assign({ wait: 0 }, config)

  const step = () => {
    if (interval) api.clearInterval(interval)

    context  = next(context) || context
    interval = api.setInterval(step, context.wait)
  }

  if (config.immediate) step()

  let interval = api.setInterval(step, context.wait)

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
    }
  }
}

export default setDynterval
