// http://stackoverflow.com/a/7445863

// const setInterval = require('accurate-interval')
// const setInterval = require('./interval')
// const { setInterval, clearInterval } = require('rolex')

import Rolex from 'rolex'

/**
 * @param {Function} next method that calculates and returns the interval gap for the next tick
 * @param {Object|Number} config initial configuration object / context. ex: { wait: 50 }
 * @param {Boolean} [haste] when true, the `next` function will be invoked on instantiation (immediately)
 * @returns {Object}
 */
// TODO: support event hooks
export const setDynterval = (next, config) => {
  if (config && config.constructor === Number) {
    config = { wait: config }
  }

  let context = Object.assign({ wait: 0, aligned: false, immediate: false }, config)
  let prev = null

  const { aligned, immediate } = context

  const step = () => {
    if (interval) interval.clear()

    // // TODO: only reset the interval if the `wait` has changed from the previous value
    context  = next(context) || context
    interval = setInterval(step, context.wait, { aligned, immediate })
  }

  if (config.haste) {
    context = next(context) || context
  }

  let interval = setInterval(step, context.wait, { aligned, immediate })

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
      // interval.clear()
      clearInterval(interval)
    }
  }
}

export default setDynterval
