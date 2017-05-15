# dynamic-interval

> :clock: The dynamic setInterval

Exactly like the all-familiar `setInterval` except that it also accepts a function that allows you calculate a new interval size on each iteration / tick.

Also referred to as a "dynterval".

## Example

This script doubles the amount of time between intervals on each iteration, starting with 50ms:

```js
setDynerval(interval => {
  console.log('interval', interval)

  return interval.wait * 2
}, 50)

// interval { wait: 50 }
// interval { wait: 100 }
// interval { wait: 200 }
// ...
```

## License

MIT
