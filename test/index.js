const setDynterval = require('../dist/index').default
const sinon = require('sinon')
const test = require('tape')

test('basic', t => {
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

