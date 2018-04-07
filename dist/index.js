'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDynterval = setDynterval;
// http://stackoverflow.com/a/7445863

/**
 * @param {Function} action interval callback that may return a different duration for the next tick
 * @param {Object|Number} [config] initial configuration object / context. ex: { wait: 50, immediate: false }
 * @param {Object} [api] custom interval API (defaults to `window.setTimeout` and `window.clearTimeout`)
 * @returns {Object}
 */
function setDynterval(action) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var api = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { setTimeout: setTimeout, clearTimeout: clearTimeout, setInterval: setInterval, clearInterval: clearInterval };

  if (!action || !(action instanceof Function)) {
    throw Error('Interval callback must be a function');
  }

  if (!api || (!(api.setTimeout instanceof Function) || !(api.clearTimeout instanceof Function)) && (!(api.setInterval instanceof Function) || !(api.clearInterval instanceof Function))) {
    throw Error('Custom interval APIs must define either `setTimeout` and `clearTimeout` OR `setInterval` and `clearInterval` functions');
  }

  if (config.constructor === Number) {
    config = { wait: config };
  }

  var context = Object.assign({ wait: 0 }, config);

  var next = api.setTimeout || api.setInterval;
  var _clear = api.clearTimeout || api.clearInterval;

  var step = function step() {
    if (interval) api.clearTimeout(interval);

    context = action(context) || context;
    interval = next(step, context.wait);
  };

  if (config.immediate) step();

  var interval = next(step.bind(this), context.wait);

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
        return _clear(interval);
      }, 0);
      // clear(interval)
    }
  };
}

exports.default = setDynterval;