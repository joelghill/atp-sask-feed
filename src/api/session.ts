
import { AppContext } from '../config.js'
import ExpressSession from 'express-session'
import { TypeormStore } from 'connect-typeorm'

const handler = (ctx: AppContext) => {
  const router = ExpressSession({
    resave: false,
    saveUninitialized: false,
    store: ctx.controller.sessionStore,
    secret: 'keyboard cat',
  })

  return router
}

export default handler
