'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = accurateInterval;
// const time = require('performance-now')
var time = require('present');

/**
 * Create an accurate interval that does not skew over time.
 * @param  {function}   func      Function to call ever interval ms
 * @param  {number}   interval    Interval (in ms) with which to call func
 * @param  {Object}   opts      Interval (in ms) with which to call func
 * @param  {boolean}  opts.aligned  Align timestamps
 * @param  {boolean}  opts.immediate  Call func immediately as well
 * @return {Object}           Object with clear method
 */
function accurateInterval(func, interval, opts) {
  if (!opts) opts = {};

  var clear = void 0,
      next = void 0,
      timeout = void 0,
      wrapper = void 0,
      now = void 0;

  // now = new Date().getTime()
  now = time();

  next = now;

  if (opts.aligned) {
    next += interval - now % interval;
  }

  if (!opts.immediate) {
    next += interval;
  }

  timeout = null;

  wrapper = function wrapper() {
    var scheduledTime = next;

    next += interval;
    timeout = setTimeout(wrapper, next - time());

    func(scheduledTime);
  };

  clear = function clear() {
    return clearTimeout(timeout);
  };

  timeout = setTimeout(wrapper, next - time());

  return {
    clear: clear
  };
}