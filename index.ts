// http://stackoverflow.com/a/7445863

// const setInterval = require('accurate-interval')

import setInterval from 'accurate-interval'

export interface IntervalEngine {
  create: Function,
  clear: Function
}

/**
 * @param {Function} next method that calculates and returns the interval gap for the next tick
 * @param {Object|Number} config initial configuration object / context. ex: { wait: 50 }
 * @returns {Object}
 */
// TODO: support event hooks
export const setDynterval = (next, config) => {
  if (config && config.constructor === Number) {
    config = { wait: config }
  }

  let context = Object.assign({ wait: 0, aligned: false, immediate: false }, config)

  const { aligned, immediate } = context

  const step = () => {
    if (interval) interval.clear()

    context  = next(context) || context
    interval = setInterval(step, context.wait, { aligned, immediate })
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
      interval.clear()
    }
  }
}

export default setDynterval
