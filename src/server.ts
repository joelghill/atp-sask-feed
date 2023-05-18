import http from 'http'
import events from 'events'
import express from 'express'
import AdminJS from 'adminjs'
import AdminJsExpress from '@adminjs/express'
import { DidResolver, MemoryCache } from '@atproto/did-resolver'
import { createServer } from './lexicon/index.js'
import feedGeneration from './feed-generation.js'
import { createDb, Database, migrateToLatest } from './db/index.js'
import { FirehoseSubscription } from './subscription.js'
import { AppContext, Config } from './config.js'
import wellKnown from './well-known.js'

export class FeedGenerator {
  public app: express.Application
  public server?: http.Server
  public db: Database
  public firehose: FirehoseSubscription
  public cfg: Config

  constructor(
    app: express.Application,
    db: Database,
    firehose: FirehoseSubscription,
    cfg: Config,
  ) {
    this.app = app
    this.db = db
    this.firehose = firehose
    this.cfg = cfg
  }

  static create(config?: Partial<Config>) {
    const cfg: Config = {
      port: config?.port ?? 3000,
      hostname: config?.hostname ?? 'feed-generator.test',
      sqliteLocation: config?.sqliteLocation ?? ':memory:',
      subscriptionEndpoint: config?.subscriptionEndpoint ?? 'wss://bsky.social',
      serviceDid: config?.serviceDid ?? 'did:example:test',
    }

    const app = express()

    // Setup AdminJS
    const admin = new AdminJS({})
    const adminRouter = AdminJsExpress.buildRouter(admin)
    admin.watch()

    const db = createDb(cfg.sqliteLocation)
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

    app.use(server.xrpc.router)
    app.use(wellKnown(cfg.hostname))
    app.use(admin.options.rootPath, adminRouter)

    return new FeedGenerator(app, db, firehose, cfg)
  }

  async start(): Promise<http.Server> {
    await migrateToLatest(this.db)
    this.firehose.run()
    this.server = this.app.listen(this.cfg.port)
    await events.once(this.server, 'listening')
    return this.server
  }
}

export default FeedGenerator
