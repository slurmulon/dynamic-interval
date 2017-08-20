// http://stackoverflow.com/a/7445863

const pauseable = require('pauseable')

/**
 * @param {Function} next method that calculates and returns the interval gap for the next tick
 * @param {Object} config initial configuration object / context. ex: { wait: 50 }
 * @returns {Function}
 */
export const setDynterval = (next, config) => {
  let context = Object.assign({ wait: 0 }, config)

  const step = () => {
    // clearInterval(interval)
    interval.clear()

    context = next(context) || context

    interval = pauseable.setInterval(context.wait, step)
  }

  let interval = pauseable.setInterval(context.wait, step)

  return interval
}

