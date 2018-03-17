'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDynterval = undefined;

var _interval = require('./interval');

var _interval2 = _interopRequireDefault(_interval);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import * as audioContextTimers from 'audio-context-timers'

// const setInterval = audioContextTimers.setInterval
// const clearInterval = audioContextTimers.clearInterval

// import * as workerTimers from 'worker-timers'

console.log('das interval', _interval2.default);

/**
 * @param {Function} next method that calculates and returns the interval gap for the next tick
 * @param {Object|Number} config initial configuration object / context. ex: { wait: 50 }
 * @param {Boolean} [haste] when true, the `next` function will be invoked on instantiation (immediately)
 * @returns {Object}
 */
// TODO: support event hooks
// http://stackoverflow.com/a/7445863

// const setInterval = require('accurate-interval')
// const setInterval = require('./interval').default
// const { setInterval, clearInterval } = require('rolex')

// import Rolex from 'rolex'

// const setInterval = require('request-interval')

var setDynterval = exports.setDynterval = function setDynterval(next, config) {
  if (config && config.constructor === Number) {
    config = { wait: config };
  }

  var context = Object.assign({ wait: 0, aligned: false, immediate: false }, config);
  var prev = null;

  var _context = context,
      aligned = _context.aligned,
      immediate = _context.immediate;


  var step = function step() {
    if (interval) interval.clear(); // accurate-interval
    // if (interval) clearInterval(interval) // core, audio, Rolex
    // if (interval) setInterval.clear(interval) // request-interval
    // if (interval) workerTimers.clearInterval(interval)

    // // TODO: only reset the interval if the `wait` has changed from the previous value
    context = next(context) || context;
    // interval = setInterval(step, context.wait, { aligned, immediate })
    // interval = setInterval(context.wait, step)
    interval = (0, _interval2.default)(step, context.wait);
    // interval = workerTimers.setInterval(step, context.wait)
  };

  if (config.haste) {
    context = next(context) || context;
  }

  // let interval = setInterval(step, context.wait, { aligned, immediate })
  // let interval = setInterval(context.wait, step)
  var interval = (0, _interval2.default)(step, context.wait);
  // let interval = workerTimers.setInterval(step, context.wait)

  return {
    get current() {
      return interval;
    },

    get context() {
      return context;
    },

    set context(value) {
      context = value;
    },

    clear: function clear() {
      interval.clear(); // accurate-interval
      // clearInterval(interval) // core, audio, Rolex
      // setInterval.clear(interval) // request-interval
      // workerTimers.clearInterval(interval) // worker-interval
    }
  };
};

exports.default = setDynterval;