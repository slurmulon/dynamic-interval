"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// http://stackoverflow.com/a/7445863

/**
 * @param {Function} next method that calculates and returns the interval gap for the next tick
 * @param {Object|Number} config initial configuration object / context. ex: { wait: 50 }
 * @param {Boolean} [haste] when true, the `next` function will be invoked on instantiation (immediately)
 * @returns {Object}
 */
// TODO: support event hooks
var setDynterval = exports.setDynterval = function setDynterval(next, config, haste) {
  if (config && config.constructor === Number) {
    config = { wait: config };
  }

  var context = Object.assign({ wait: 0 }, config);

  var step = function step() {
    if (interval) clearInterval(interval);

    context = next(context) || context;
    interval = setInterval(step, context.wait);
  };

  if (haste) step();

  var interval = setInterval(step, context.wait);

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
      setTimeout(function () {
        return clearInterval(interval);
      }, 0);
    }
  };
};

exports.default = setDynterval;