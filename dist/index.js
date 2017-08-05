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
// TODO: allow this to support a proper context objec tthat allows users to piggy
// back state through each tick
// export const setDynterval = (next, wait, ctx = {}) => {
//   let context = Object.assign(ctx, { wait })

//   const step = () => {
//     clearInterval(interval)

//     // context.wait = next(context).wait || context.wait
//     context = next(context) || context

//     interval = setInterval(step, context.wait)
//   }

//   let interval = setInterval(step, context.wait)

//   return interval
// }

var setDynterval = exports.setDynterval = function setDynterval(next, init) {
  var context = Object.assign({ wait: 0 }, init);

  var step = function step() {
    clearInterval(interval);

    // context.wait = next(context).wait || context.wait
    context = next(context) || context;

    interval = setInterval(step, context.wait);
  };

  var interval = setInterval(step, context.wait);

  return interval;
};