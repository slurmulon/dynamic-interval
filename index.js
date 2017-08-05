// http://stackoverflow.com/a/7445863

/**
 * @param {Function} next method that calculates and returns the interval gap for the next tick
 * @param {Object} init initial configuration object / context. ex: { wait: 50 }
 * @returns {Function}
 */
export const setDynterval = (next, init) => {
  let context = Object.assign({ wait: 0 }, init)

  const step = () => {
    clearInterval(interval)

    context = next(context) || context

    interval = setInterval(step, context.wait)
  }

  let interval = setInterval(step, context.wait)

  return interval
}

