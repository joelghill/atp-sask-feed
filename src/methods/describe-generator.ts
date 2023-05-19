import { Server } from '../lexicon/index.js'
import { AppContext } from '../config.js'
import algos from '../algos/index.js'

export default function (server: Server, ctx: AppContext) {
  server.app.bsky.feed.describeFeedGenerator(async () => {
    const feeds = Object.keys(algos).map((uri) => ({ uri }))
    return {
      encoding: 'application/json',
      body: {
        did: ctx.cfg.serviceDid,
        feeds,
      },
    }
  })
}
