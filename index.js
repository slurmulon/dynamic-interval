// http://stackoverflow.com/a/7445863

/**
 * @param {Function} next method that returns the interval gap for the next tick
 * @param {Number} init initial interval gap
 * @returns {Function}
 */
export const setDynterval = (next, init) => {
  const context = { wait: init }

  const step = () => {
    clearInterval(interval)

    context.wait = next(context) || context.wait

    interval = setInterval(step, context.wait)
  }

  let interval = setInterval(step, context.wait)

  return interval
}

