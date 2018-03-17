// http://stackoverflow.com/a/7445863

// const setInterval = require('accurate-interval')
// const setInterval = require('./interval').default
// const { setInterval, clearInterval } = require('rolex')

// import Rolex from 'rolex'

// const setInterval = require('request-interval')

import setInterval from './interval'

// import * as audioContextTimers from 'audio-context-timers'

// const setInterval = audioContextTimers.setInterval
// const clearInterval = audioContextTimers.clearInterval

// import * as workerTimers from 'worker-timers'

console.log('das interval', setInterval)

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
    if (interval) interval.clear() // accurate-interval
    // if (interval) clearInterval(interval) // core, audio, Rolex
    // if (interval) setInterval.clear(interval) // request-interval
    // if (interval) workerTimers.clearInterval(interval)

    // // TODO: only reset the interval if the `wait` has changed from the previous value
    context  = next(context) || context
    // interval = setInterval(step, context.wait, { aligned, immediate })
    // interval = setInterval(context.wait, step)
    interval = setInterval(step, context.wait)
    // interval = workerTimers.setInterval(step, context.wait)
  }

  if (config.haste) {
    context = next(context) || context
  }

  // let interval = setInterval(step, context.wait, { aligned, immediate })
  // let interval = setInterval(context.wait, step)
  let interval = setInterval(step, context.wait)
  // let interval = workerTimers.setInterval(step, context.wait)

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
      interval.clear() // accurate-interval
      // clearInterval(interval) // core, audio, Rolex
      // setInterval.clear(interval) // request-interval
      // workerTimers.clearInterval(interval) // worker-interval
    }
  }
}

export default setDynterval
