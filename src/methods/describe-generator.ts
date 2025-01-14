import { AppContext } from '../config.js'
import getAlgos from '../algos/index.js'
import { AtUri } from '@atproto/uri'

export default function (ctx: AppContext) {
  ctx.atp.app.bsky.feed.describeFeedGenerator(async () => {
    const feeds = Object.keys(getAlgos()).map((shortname) => ({
      uri: AtUri.make(
        ctx.cfg.publisherDid,
        'app.bsky.feed.generator',
        shortname,
      ).toString(),
    }))
    return {
      encoding: 'application/json',
      body: {
        did: ctx.cfg.serviceDid,
        feeds,
      },
    }
  })
}
