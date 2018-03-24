const setDynterval = require('../dist/index').default
const sinon = require('sinon')
const test = require('tape')

test('static', t => {
  const spy = sinon.spy()
  const wait = 50
  const interval = setDynterval(spy, wait)

  setTimeout(() => {
    console.log('spy', spy.callCount)
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
