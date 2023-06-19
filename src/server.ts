import http from 'http'
import events from 'events'
import express from 'express'
import { DidResolver, MemoryCache } from '@atproto/did-resolver'
import { createServer } from './lexicon/index.js'
import feedGeneration from './methods/feed-generation.js'
import describeGenerator from './methods/describe-generator.js'
import { FirehoseSubscription } from './subscription.js'
import { AppContext, Config } from './config.js'
import wellKnown from './well-known.js'
import healthCheck from './health-check.js'
import { Controller } from './controller.js'
import { initAdmin } from './admin/index.js'

export class FeedGenerator {
  public app: express.Application
  public server?: http.Server
  controller: Controller
  public firehose: FirehoseSubscription
  public cfg: Config

  /** */
  constructor(
    app: express.Application,
    controller: Controller,
    firehose: FirehoseSubscription,
    cfg: Config,
  ) {
    this.app = app
    this.controller = controller
    this.firehose = firehose
    this.cfg = cfg
  }

  /**
   * Creates a new FeedGenerator instance.
   * @param db The database connection.
   * @param cfg The configuration.
   * @returns A new FeedGenerator instance.
   */
  static create(controller: Controller, cfg: Config) {
    const app = express()

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
      currentApp: app,
      atp: server,
      controller,
      didResolver,
      cfg,
    }

    // Initialize the admin routes
    initAdmin(ctx)

    // Initialize the firehose
    const firehose = new FirehoseSubscription(ctx)

    feedGeneration(ctx)
    describeGenerator(ctx)
    app.use(server.xrpc.router)
    app.use(wellKnown(ctx))
    app.use(healthCheck())

    return new FeedGenerator(app, controller, firehose, cfg)
  }

  async start(): Promise<http.Server> {
    console.log('Starting feed generator...')
    console.log('Config: ', this.cfg)
    this.firehose.run(this.cfg.subscriptionReconnectDelay)
    this.server = this.app.listen(this.cfg.port, this.cfg.listenhost)
    await events.once(this.server, 'listening')
    return this.server
  }
}

export default FeedGenerator
