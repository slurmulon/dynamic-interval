const setDynterval = require('./dist/index').setDynterval

const test = setDynterval(ctx => {
  console.log('waiting', ctx.wait, ctx.direction)

  if (ctx.direction === 'up') {
    if (ctx.wait >= 500) {
      ctx.direction ='down'
    } else  {
      return Object.assign(ctx, { wait: ctx.wait * 2 })
    }
  } else {
    if (ctx.wait <= 25) {
      ctx.direction = 'up'
    } else {
      return Object.assign(ctx, { wait: ctx.wait / 2 })
    }
  }

  // return ctx.wait
  return ctx
}, { wait: 50, direction: 'up' })

console.log('! set interval', test)

setTimeout(() => {
  console.log('! cleared interval', test)

  test.clear()

  setTimeout(() => console.log('done'), 1000)
}, 4000)
