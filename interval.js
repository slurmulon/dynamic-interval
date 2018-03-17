// const time = require('performance-now')
const time = require('present')

/**
 * Create an accurate interval that does not skew over time.
 * @param  {function}   func      Function to call ever interval ms
 * @param  {number}   interval    Interval (in ms) with which to call func
 * @param  {Object}   opts      Interval (in ms) with which to call func
 * @param  {boolean}  opts.aligned  Align timestamps
 * @param  {boolean}  opts.immediate  Call func immediately as well
 * @return {Object}           Object with clear method
 */
export default function accurateInterval (func, interval, opts) {
  if (!opts) opts = {}

  let  clear, next, timeout, wrapper, now

  // now = new Date().getTime()
  now = time()

  next = now

  if (opts.aligned) {
    next += interval - (now % interval)
  }

  if (!opts.immediate) {
    next += interval
  }

  timeout = null

  wrapper = function wrapper () {
    const scheduledTime = next

    next += interval
    timeout = setTimeout(wrapper, next - time())

    func(scheduledTime)
  }

  clear = function clear () {
    return clearTimeout(timeout)
  }

  timeout = setTimeout(wrapper, next - time())

  return {
    clear: clear
  }

}
