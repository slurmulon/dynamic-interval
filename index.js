// http://stackoverflow.com/a/7445863

/**
 * @param {Function} next method that calculates and returns the interval gap for the next tick
 * @param {Object} config initial configuration object / context. ex: { wait: 50 }
 * @returns {Function}
 */
export const setDynterval = (next, config) => {
  if (config && config.constructor === Number) {
    config = { wait: config }
  }

  let context = Object.assign({ wait: 0 }, config)

  const step = () => {
    clearInterval(interval)

    context = next(context) || context

    interval = setInterval(step, context.wait)
  }

  let interval = setInterval(step, context.wait)

  return {
    get current () {
      return interval
    },

    clear () {
      clearInterval(interval)
    }
  }
}

export default setDynterval
