'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// http://stackoverflow.com/a/7445863

var setInterval = require('accurate-interval');

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

  var context = Object.assign({ wait: 0 }, config);

  var _Object$assign = Object.assign({ aligned: false, immediate: false }, context),
      aligned = _Object$assign.aligned,
      immediate = _Object$assign.immediate;

  var step = function step() {
    // if (interval) clearInterval(interval)
    if (interval) interval.clear();

    // console.log('[dynamic-interval] stepping')

    context = next(context) || context;
    interval = setInterval(step, context.wait, { aligned: aligned, immediate: false });
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
      interval.clear();
      // setTimeout(() => clearInterval(interval), 0)
    }
  };
};

exports.default = setDynterval;