'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDynterval = undefined;

var _workerTimers = require('worker-timers');

var workerTimers = _interopRequireWildcard(_workerTimers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * @param {Function} next method that calculates and returns the interval gap for the next tick
 * @param {Object|Number} config initial configuration object / context. ex: { wait: 50 }
 * @param {Boolean} [haste] when true, the `next` function will be invoked on instantiation (immediately)
 * @returns {Object}
 */
// TODO: support event hooks
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
    // if (interval) interval.clear()
    if (interval) workerTimers.clearInterval(interval);

    // // TODO: only reset the interval if the `wait` has changed from the previous value
    context = next(context) || context;
    // interval = setInterval(step, context.wait, { aligned, immediate })
    // interval = setInterval(context.wait, step)
    interval = workerTimers.setInterval(step, context.wait);
  };

  if (config.haste) {
    context = next(context) || context;
  }

  // let interval = setInterval(step, context.wait, { aligned, immediate })
  // let interval = setInterval(context.wait, step)
  var interval = workerTimers.setInterval(step, context.wait);

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
      // interval.clear()
      // clearInterval(interval)
      // setInterval.clear(interval)
      workerTimers.clearInterval(interval);
    }
  };
}; // http://stackoverflow.com/a/7445863

// const setInterval = require('accurate-interval')
// const setInterval = require('./interval')
// const { setInterval, clearInterval } = require('rolex')

// import Rolex from 'rolex'

// const setInterval = require('request-interval')

exports.default = setDynterval;