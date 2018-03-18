# dynamic-interval

> :clock1: The dynamic setInterval

---

Just like the all-familiar `setInterval` except that it also accepts a function that allows you calculate a new interval size on each iteration / tick.

Also referred to as a "dynterval".

## Install

```npm install slurmulon/dynamic-interval```

then

```js
import setDynterval from 'dynamic-interval'
```

## Interface

```setDynterval(<action>, <config>, <api>)```

### `action`

The callback to invoke on each interval tick

- **Type**: `Function`
- **Required**

### `config`

Specifies the configuration of the interval. Passed into the `action` function as `context`.

- **Type**: `Object`

- **Properties**:

  * #### `wait`

    Species how long to wait between each interval tick

    - **Type**: `Number`

  * #### `immediate`

    Determines if the interval should start immediately or wait before starting

    - **Type**: `Boolean`

### `api`

A custom interval `api` may be provided. It must define functions for both `setInterval` and `clearInterval`.

Uses `window.setInterval` and `window.clearInterval` when not defined by the user.

- **Type**: `Object`

## Examples

### Basic

This script doubles the amount of time between intervals on each iteration, starting with 50ms:

```js
import setDynterval from 'dynamic-interval'

// you can attach arbitrary properties to this object (in this case, `rate`), but
// `wait` is what's used to determine the duration between each interval
const config = { wait: 50, rate: 2 }

const dynterval = setDynterval(context => {
  console.log('interval', context)

  const next = context.wait * context.rate

  return { ...context, wait: next }
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

    return { ...context, drift, wait: next }
  }, { wait, api: workerTimers })
}

setAccurateInterval(context => console.log('tick', context), 1000)
```

## License

MIT
