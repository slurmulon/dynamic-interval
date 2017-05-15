"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// http://stackoverflow.com/a/7445863

/**
 * @param {Function} next method that returns the interval gap for the next tick
 * @param {Number} init initial interval gap
 * @returns {Function}
 */
var setDynterval = exports.setDynterval = function setDynterval(next, init) {
  var context = { wait: init };

  var step = function step() {
    clearInterval(interval);

    context.wait = next(context) || context.wait;

    interval = setInterval(step, context.wait);
  };

  var interval = setInterval(step, context.wait);

  return interval;
};