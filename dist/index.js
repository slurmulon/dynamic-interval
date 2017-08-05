"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// http://stackoverflow.com/a/7445863

/**
 * @param {Function} next method that calculates and returns the interval gap for the next tick
 * @param {Object} init initial configuration object / context. ex: { wait: 50 }
 * @returns {Function}
 */
var setDynterval = exports.setDynterval = function setDynterval(next, init) {
  var context = Object.assign({ wait: 0 }, init);

  var step = function step() {
    clearInterval(interval);

    context = next(context) || context;

    interval = setInterval(step, context.wait);
  };

  var interval = setInterval(step, context.wait);

  return interval;
};