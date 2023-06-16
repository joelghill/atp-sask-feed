import { InvalidRequestError } from '@atproto/xrpc-server'
import { AppContext } from '../config.js'
import getAlgos from '../algos/index.js'
import { validateAuth } from '../auth.js'
import { AtUri } from '@atproto/uri'

export default function (ctx: AppContext) {
  const algos = getAlgos()
  ctx.atp.app.bsky.feed.getFeedSkeleton(async ({ params, req }) => {
    const feedUri = new AtUri(params.feed)
    const algo = algos[feedUri.rkey]
    if (
      feedUri.hostname !== ctx.cfg.publisherDid ||
      feedUri.collection !== 'app.bsky.feed.generator' ||
      !algo
    ) {
      throw new InvalidRequestError(
        'Unsupported algorithm',
        'UnsupportedAlgorithm',
      )
    }
    /**
     * Example of how to check auth if giving user-specific results:
     */
    const requesterDid = await validateAuth(
      req,
      ctx.cfg.serviceDid,
      ctx.didResolver,
    )

    if (requesterDid) {
      // Update subscriber entry in database
      ctx.controller.saveSubscriber(requesterDid)
    }

    const body = await algo(ctx.controller, params)
    return {
      encoding: 'application/json',
      body: body,
    }
  })
}
