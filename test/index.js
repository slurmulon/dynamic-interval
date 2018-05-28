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
  const interval = setDynterval(ctx => {
    const next = ctx.wait * 2

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

test('context [setter]', t => {
  const interval = setDynterval(ctx => {}, 1)
  const expected = { works: true }

  interval.context = expected
  interval.clear()

  t.equal(interval.context, expected)
  t.end()
})

test('action [valid]', t => {
  const spy = sinon.spy()

  setDynterval(spy, 1).clear()

  t.pass()
  t.end()
})

test('action [invalid]', t => {
  try {
    setDynterval(0)

    t.fail()
  } catch (e) {
    t.equal(e.constructor, TypeError)
  }

  t.end()
})

test('step [context]', t => {
  const nextCtx = { newCtx: true, dynamic: true, wait: 25 }
  const interval = setDynterval(ctx => ({ ...ctx, ...nextCtx }), nextCtx.wait)

  setTimeout(() => {
    interval.clear()

    t.deepEqual(interval.context, nextCtx)
    t.end()
  }, 50)
})

test('step [interval]', t => {
  let id = 0
  const mockSetTimeout = (cb, wait) => {
    id = setTimeout(cb, wait)

    return id
  }

  const interval = setDynterval(() => {}, 1, { setTimeout: mockSetTimeout, clearTimeout })

  setTimeout(() => {
    interval.clear()

    t.equal(interval.current, id)
    t.end()
  }, 20)
})

test('step [clear]', t => {
  const stubInterval = Symbol('interval')
  const spyClearTimeout = sinon.spy()
  const mockSetTimeout = (action, wait) => {
    const cb = () => {
      try {
        action()
      } catch (e) {
        t.true(spyClearTimeout.calledWith(stubInterval))
        t.end()
      }
    }

    setTimeout(cb, wait)

    return stubInterval
  }

  setDynterval(() => { throw Error('interrupt') }, 1, { setTimeout: mockSetTimeout, clearTimeout: spyClearTimeout })
})

test('config [immediate = true]', t => {
  const cb = sinon.spy()
  const wait = 5
  const interval = setDynterval(cb, { wait, immediate: true })

  t.true(cb.calledOnce)

  setTimeout(() => {
    interval.clear()

    t.true(cb.calledTwice)
    t.end()
  }, wait + 1)
})

test('config [immediate = false]', t => {
  const cb = sinon.spy()
  const wait = 5
  const interval = setDynterval(cb, { wait, immediate: false })

  t.true(cb.notCalled)

  setTimeout(() => {
    interval.clear()

    t.true(cb.calledOnce)
    t.end()
  }, wait + 1)
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

test('api [invalid-timeout:partial]', t => {
  try {
    setDynterval(() => {}, 1, { setTimeout })

    t.fail()
  } catch (e) {
    t.pass()
  }

  t.end()
})

test('api [invalid-timeout:bad-type]', t => {
  try {
    setDynterval(() => {}, 1, { setTimeout: 0, clearTimeout: 0 })
  } catch (e) {
    t.pass()
  }

  t.end()
})

test('api [invalid-interval:partial]', t => {
  try {
    setDynterval(() => {}, 1, { setInterval })

    t.fail()
  } catch (e) {
    t.pass()
  }

  t.end()
})

test('api [invalid-interval:bad-type]', t => {
  try {
    setDynterval(() => {}, 1, { setInterval: 0, clearInterval: 0 })
  } catch (e) {
    t.pass()
  }

  t.end()
})
