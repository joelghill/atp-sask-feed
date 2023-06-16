import { InvalidRequestError } from '@atproto/xrpc-server'
import { AppContext } from '../config.js'
import getAlgos from '../algos/index.js'
import { validateAuth } from '../auth.js'

export default function (ctx: AppContext) {
  ctx.atp.app.bsky.feed.getFeedSkeleton(async ({ params, req }) => {
    const algo = getAlgos(ctx)[params.feed]
    if (!algo) {
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
