'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// http://stackoverflow.com/a/7445863
var setDynterval = exports.setDynterval = function setDynterval(next, init) {
  var context = { wait: init };

  var step = function step() {
    clearInterval(interval);

    context.wait = next(context);

    interval = setInterval(step, context.wait);
  };

  var interval = setInterval(step, context.tick);

  return interval;
};

// TEST

setDynterval(function (interval) {
  console.log('interval', interval);return interval.wait * 2;
}, 50);
