const setDynterval = require('./dist/index').setDynterval

setDynterval(ctx => {
  // ctx.direction = 'up'

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

