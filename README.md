# dynamic-interval

> :clock1: The dynamic setInterval

---

Just like the all-familiar `setInterval` except that it also accepts a function that allows you calculate a new interval size on each iteration / tick.

Also referred to as a "dynterval".

## Examples

### Basic

This script doubles the amount of time between intervals on each iteration, starting with 50ms:

```js
import setDynterval from 'dynamic-interval'

// you can attach arbitrary properties to this object, but `wait`
// is what's used to determine the duration between each interval
const config = { wait: 50 }

const dynterval = setDynterval(interval => {
  console.log('interval', interval)

  return { wait: interval.wait * 2 }
}, config)

// interval { wait: 50 }
// interval { wait: 100 }
// interval { wait: 200 }
// ...

// clear out the interval after 2 seconds
// NOTE: `window.clearInterval` is not compatible! use the `clear` method instead
setTimeout(() => {
  dynterval.clear()
}, 2000)
```

### Advanced

This script calculates the amount of drift on each step and corrects for it during the subsequent step.

It uses a custom interval `api`. In this case, we're using [`worker-timers`](https://www.npmjs.com/package/worker-timers).

```js
import setDynterval from 'dynamic-interval'
import * as workerTimers from 'worker-timers'

const setAccurateInterval = (func, wait) => {
  let expected = Date.now() + wait

  return setDynterval(context => {
    const drift = Date.now() - expected

    if (drift > wait)
      throw Error(`that drift be crazy: ${drift}`)

    expected += wait

    const next = Math.min(0, wait - drift)

    func(context)

    return Object.assign(context, { wait: next, drift })
  }, { wait, api: workerTimers })
}

setAccurateInterval(context => console.log('tick', context), 1000)
```

## License

MIT
