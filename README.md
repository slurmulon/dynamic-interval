# dynamic-interval

> :clock1: The dynamic setInterval

---

[![build](https://img.shields.io/circleci/project/github/RedSparr0w/node-csgo-parser.svg?style=for-the-badge)](https://circleci.com/gh/slurmulon/dynamic-interval)
[![npm](https://img.shields.io/npm/v/dynamic-interval.svg?style=for-the-badge)](https://npmjs.com/package/dynamic-interval)

`setInterval` with the ability to specify a new interval duration on each tick.

Also referred to as a "dynterval".

## Sections

- [Install](#install)
- [Usage](#usage)
- [Examples](#examples)
  * [Basic](#basic)
  * [Advanced](#advanced)
- [Interface](#interface)
- [Related](#related)
- [License](#license)

## Install

```sh
npm install dynamic-interval
```

## Usage

```js
import setDynterval from 'dynamic-interval'

const dynterval = setDynterval(ctx => console.log('tick!', ctx), 100)
```

## Examples

### Basic

This script doubles the duration of the interval on each iteration, starting with 50ms:

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

// interval { wait: 50,  rate: 2 }
// interval { wait: 100, rate: 2 }
// interval { wait: 200, rate: 2 }
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

    const next = Math.max(0, wait - drift)

    func(context)

    return { ...context, drift, wait: next }
  }, wait, workerTimers)
}

setAccurateInterval(context => console.log('tick', context), 1000)
```

## Interface

### ```setDynterval(<action>, <wait|config>, <api>)```

#### `action`

The callback to invoke on each interval tick

- **Type**: `Function`
- **Required**

#### `wait`

Specifies the duration of each interval (i.e. the amount of time to wait between each tick)

- **Type**: `Number`


#### `config`

Specifies the configuration of the interval. Passed into the `action` function as `context`.

- **Type**: `Object`

- **Properties**:

  * **`wait`**

    Specifies the duration of each interval

    - **Type**: `Number`

  * **`immediate`**

    Determines if the interval should start immediately or wait one interval before starting

    - **Type**: `Boolean`
    - **Default**: `false`

#### `api`

A custom interval `api` may be provided. It must define functions for both `setInterval` and `clearInterval`.

 - **Type**: `Object`

 - **Properties**:

   * **`setTimeout`**

     Defines how to create a new timeout

     - **Type**: `Function`
     - **Signature**: `setTimeout(func: Function, delay: Number)`
     - **Returns**: `TimeoutID`
     - **Default**: [`WindowOrWorkerGlobalScope.setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)

   * **`clearTimeout`**

     Defines how to clear or cancel a timeout

     - **Type**: `Function`
     - **Signature**: `clearTimeout(id: TimeoutID)`
     - **Returns**: `void`
     - **Default**: [`WindowOrWorkerGlobalScope.clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearTimeout)

   * **`setInterval`**

     Defines how to create a new interval

     - **Type**: `Function`
     - **Signature**: `setInterval(func: Function, delay: Number)`
     - **Returns**: `IntervalID`
     - **Default**: [`WindowOrWorkerGlobalScope.setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval)

   * **`clearInterval`**

     Defines how to clear or cancel an interval

     - **Type**: `Function`
     - **Signature**: `clearInterval(id: IntervalID)`
     - **Returns**: `void`
     - **Default**: [`WindowOrWorkerGlobalScope.clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearInterval)


## Related

- [`stateful-dynamic-interval`](https://github.com/slurmulon/stateful-dynamic-interval) adds pause, resume and grouping functionality to `dynamic-interval`.
- [`accurate-interval`](https://npmjs.com/accurate-interval) an interval that automatically corrects for local drift on each tick. May be provided as an `api`.
- [`audio-context-timers`](https://npmjs.com/audio-context-timers) an interval that uses the Web Audio API clock. May be provided as an `api`.
- [`worker-timers`](https://npmjs.com/worker-timers) an interval that uses Service Workers as a backend. May be provided as an `api`.

## License

MIT
