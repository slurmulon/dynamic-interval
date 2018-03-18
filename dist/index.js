'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDynterval = setDynterval;
// http://stackoverflow.com/a/7445863

/**
 * @param {Function} action interval callback that may return a different duration for the next tick
 * @param {Object|Number} [config] initial configuration object / context. ex: { wait: 50, immediate: false }
 * @param {Object} [api] custom interval API (defaults to `window.setInterval` and `window.clearInterval`)
 * @returns {Object}
 */
function setDynterval(action) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var api = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { setInterval: setInterval, clearInterval: clearInterval };

  if (!action || !(action instanceof Function)) {
    throw Error('Interval callback must be a function');
  }

  if (!api || !(api.setInterval instanceof Function) || !(api.clearInterval instanceof Function)) {
    throw Error('Custom interval APIs must define both `setInterval` and `clearInterval` functions');
  }

  if (config.constructor === Number) {
    config = { wait: config };
  }

  var context = Object.assign({ wait: 0 }, config);

  var step = function step() {
    if (interval) api.clearInterval(interval);

    context = action(context) || context;
    interval = api.setInterval(step, context.wait);
  };

  if (config.immediate) step();

  var interval = api.setInterval(step, context.wait);

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
        return api.clearInterval(interval);
      }, 0);
    }
  };
}

exports.default = setDynterval;