// http://stackoverflow.com/a/7445863

// const setInterval = require('accurate-interval')
// const setInterval = require('./interval')
// const { setInterval, clearInterval } = require('rolex')

// import Rolex from 'rolex'

// const setInterval = require('request-interval')

import * as workerTimers from 'worker-timers'

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
    // if (interval) interval.clear()
    if (interval) workerTimers.clearInterval(interval)

    // // TODO: only reset the interval if the `wait` has changed from the previous value
    context  = next(context) || context
    // interval = setInterval(step, context.wait, { aligned, immediate })
    // interval = setInterval(context.wait, step)
    interval = workerTimers.setInterval(step, context.wait)
  }

  if (config.haste) {
    context = next(context) || context
  }

  // let interval = setInterval(step, context.wait, { aligned, immediate })
  // let interval = setInterval(context.wait, step)
  let interval = workerTimers.setInterval(step, context.wait)

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
      // clearInterval(interval)
      // setInterval.clear(interval)
      workerTimers.clearInterval(interval)
    }
  }
}

export default setDynterval
