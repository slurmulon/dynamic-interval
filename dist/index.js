'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDynterval = undefined;

var _rolex = require('rolex');

var _rolex2 = _interopRequireDefault(_rolex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_rolex2.default.conflictInterval();

/**
 * @param {Function} next method that calculates and returns the interval gap for the next tick
 * @param {Object|Number} config initial configuration object / context. ex: { wait: 50 }
 * @param {Boolean} [haste] when true, the `next` function will be invoked on instantiation (immediately)
 * @returns {Object}
 */
// TODO: support event hooks
// http://stackoverflow.com/a/7445863

// const setInterval = require('accurate-interval')
// const setInterval = require('./interval')
// const { setInterval, clearInterval } = require('rolex')

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
    if (interval) interval.clear();

    // // TODO: only reset the interval if the `wait` has changed from the previous value
    context = next(context) || context;
    interval = setInterval(step, context.wait, { aligned: aligned, immediate: immediate });
  };

  if (config.haste) {
    context = next(context) || context;
  }

  var interval = setInterval(step, context.wait, { aligned: aligned, immediate: immediate });

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
      clearInterval(interval);
    }
  };
};

exports.default = setDynterval;