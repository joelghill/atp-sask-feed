import { InvalidRequestError } from '@atproto/xrpc-server'
import { Server } from '../lexicon/index.js'
import { AppContext } from '../config.js'
import algos from '../algos/index.js'
import { validateAuth } from '../auth.js'

export default function (server: Server, ctx: AppContext) {
  server.app.bsky.feed.getFeedSkeleton(async ({ params, req }) => {
    const algo = algos[params.feed]
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

    const body = await algo(ctx, params)
    return {
      encoding: 'application/json',
      body: body,
    }
  })
}
