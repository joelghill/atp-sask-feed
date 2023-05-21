import http from 'http'
import events from 'events'
import express from 'express'
import AdminJS from 'adminjs'
import AdminJsExpress from '@adminjs/express'
import { DidResolver, MemoryCache } from '@atproto/did-resolver'
import { DataSource } from 'typeorm'
import { createServer } from './lexicon/index.js'
import feedGeneration from './methods/feed-generation.js'
import describeGenerator from './methods/describe-generator.js'
import { FirehoseSubscription } from './subscription.js'
import { AppContext, Config } from './config.js'
import wellKnown from './well-known.js'
import { Post } from './entity/post.js'
import { SubState } from './entity/sub-state.js'


export class FeedGenerator {
  public app: express.Application
  public server?: http.Server
  public db: DataSource
  public firehose: FirehoseSubscription
  public cfg: Config

  constructor(
    app: express.Application,
    db: DataSource,
    firehose: FirehoseSubscription,
    cfg: Config,
  ) {
    this.app = app
    this.db = db
    this.firehose = firehose
    this.cfg = cfg
  }

  static create(db: DataSource, cfg: Config) {
    const app = express()

    const adminOptions = {
      resources: [Post, SubState],
    }
    // Setup AdminJS
    const admin = new AdminJS(adminOptions)
    const adminRouter = AdminJsExpress.buildRouter(admin)
    admin.watch()

    const firehose = new FirehoseSubscription(db, cfg.subscriptionEndpoint)

    const didCache = new MemoryCache()
    const didResolver = new DidResolver(
      { plcUrl: 'https://plc.directory' },
      didCache,
    )

    const server = createServer({
      validateResponse: true,
      payload: {
        jsonLimit: 100 * 1024, // 100kb
        textLimit: 100 * 1024, // 100kb
        blobLimit: 5 * 1024 * 1024, // 5mb
      },
    })

    const ctx: AppContext = {
      db,
      didResolver,
      cfg,
    }

    feedGeneration(server, ctx)
    describeGenerator(server, ctx)
    app.use(server.xrpc.router)
    app.use(wellKnown(ctx))
    app.use(admin.options.rootPath, adminRouter)

    return new FeedGenerator(app, db, firehose, cfg)
  }

  async start(): Promise<http.Server> {
    this.firehose.run()
    this.server = this.app.listen(this.cfg.port)
    await events.once(this.server, 'listening')
    return this.server
  }
}

export default FeedGenerator
