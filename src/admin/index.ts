import AdminJS from 'adminjs'
import AdminJsExpress from '@adminjs/express'
import { Post } from '../entity/post.js'
import { SubState } from '../entity/sub-state.js'
import { Subscriber } from '../entity/subscriber.js'
import { SessionOptions } from 'express-session'
import { AppContext } from '../config.js'
import { AtpAuthenticator } from './auth.js'


/**
 * Initializes the admin routes and the admin panel.
 * @param app The Express app to add the admin routes to.
 */
export function initAdmin(appContext: AppContext) {
  const adminOptions = {
    resources: [Post, SubState, Subscriber],
  }

  const authManager = new AtpAuthenticator(appContext)

  // Setup AdminJS
  const admin = new AdminJS(adminOptions)
  const adminRouter = AdminJsExpress.buildAuthenticatedRouter(
    admin,
    {
        authenticate: (email, password) => authManager.authenticate(email, password),
        cookieName: 'adminjs',
        cookiePassword: 'somepassword',
    },
    null,
    {
        resave: false,
        saveUninitialized: false,
        secret: 'some secret key',
        cookie: {   
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
        },
        name: 'adminjs',
        store: appContext.controller.session,
    } as SessionOptions,
  )
  admin.watch()

  appContext.currentApp.use(admin.options.rootPath, adminRouter)
}
