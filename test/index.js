const setDynterval = require('../dist/index').default
const sinon = require('sinon')
const test = require('tape')

test('static', t => {
  const spy = sinon.spy()
  const wait = 50
  const interval = setDynterval(spy, wait)

  setTimeout(() => {
    t.equal(spy.callCount, 2)
    t.end()

    interval.clear()
  }, wait * 2.5)
})

test('dynamic', t => {
  const spy = sinon.spy()
  const start = 50
  const interval = setDynterval(({ wait }) => {
    const next = wait * 2

    spy(next)

    return { wait: next }
  }, start)

  setTimeout(() => {
    t.equal(spy.callCount, 3)
    t.end()

    interval.clear()
  }, 500)
})

test('context', t => {
  const spy = sinon.spy()
  const context = { wait: 50, foo: 'bar' }
  const interval = setDynterval(ctx => {
    t.equal(ctx.foo, context.foo)
    t.end()

    interval.clear()
  }, context)
})

test('api [interval]', t => {
  const setIntervalSpy = sinon.spy()
  const clearIntervalSpy = sinon.spy()
  const interval = setDynterval(ctx => {}, 25, { setInterval: setIntervalSpy, clearInterval: clearIntervalSpy })

  setTimeout(() => {
    t.equal(setIntervalSpy.callCount, 1)

    interval.clear()

    setTimeout(() => {
      t.equal(clearIntervalSpy.callCount, 1)
      t.end()
    }, 0)
  }, 50)
})

test('api [timeout]', t => {
  const setTimeoutSpy = sinon.spy()
  const clearTimeoutSpy = sinon.spy()
  const interval = setDynterval(ctx => {}, 25, { setTimeout: setTimeoutSpy, clearTimeout: clearTimeoutSpy })

  setTimeout(() => {
    t.equal(setTimeoutSpy.callCount, 1)

    interval.clear()

    setTimeout(() => {
      t.equal(clearTimeoutSpy.callCount, 1)
      t.end()
    }, 0)
  }, 50)

})
