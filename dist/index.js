'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// http://stackoverflow.com/a/7445863

var pauseable = require('pauseable');

/**
 * @param {Function} next method that calculates and returns the interval gap for the next tick
 * @param {Object} config initial configuration object / context. ex: { wait: 50 }
 * @returns {Function}
 */
var setDynterval = exports.setDynterval = function setDynterval(next, config) {
  var context = Object.assign({ wait: 0 }, config);

  var step = function step() {
    // clearInterval(interval)
    interval.clear();

    context = next(context) || context;

    interval = pauseable.setInterval(context.wait, step);
  };

  var interval = pauseable.setInterval(context.wait, step);

  return interval;
};