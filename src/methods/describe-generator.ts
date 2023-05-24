import { AppContext } from '../config.js'
import algos from '../algos/index.js'

export default function (ctx: AppContext) {
  ctx.atp.app.bsky.feed.describeFeedGenerator(async () => {
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
