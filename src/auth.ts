import express from 'express'
import { verifyJwt } from '@atproto/xrpc-server'
import { DidResolver } from '@atproto/did-resolver'

export const validateAuth = async (
  req: express.Request,
  serviceDid: string,
  didResolver: DidResolver,
): Promise<string | null> => {
  const { authorization = '' } = req.headers
  if (!authorization.startsWith('Bearer ')) {
    return null
  }
  try {
    const jwt = authorization.replace('Bearer ', '').trim()
    return verifyJwt(jwt, serviceDid, async (did: string) => {
      return didResolver.resolveAtprotoKey(did)
    })
  }
  catch (err) {
    // Log the error and return null promise
    console.debug('Error verifying the JTW in request', err)
    return null
  }
}
