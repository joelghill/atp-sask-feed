import { InvalidRequestError } from '@atproto/xrpc-server'
import { QueryParams } from '../lexicon/types/app/bsky/feed/getFeedSkeleton.js'
import { AppContext } from '../config.js'
import { Post } from '../entity/post.js'

export const uri = 'at://did:example:alice/app.bsky.feed.generator/whats-alf'

export const handler = async (ctx: AppContext, params: QueryParams) => {
  let builder = ctx.db
    .getRepository(Post)
    .createQueryBuilder('post')
    .orderBy('post.indexedAt', 'DESC')
    .orderBy('post.cid', 'DESC')
    .limit(params.limit)

  if (params.cursor) {
    const [indexedAt, cid] = params.cursor.split('::')
    if (!indexedAt || !cid) {
      throw new InvalidRequestError('malformed cursor')
    }
    const indexedAtDate = new Date(parseInt(indexedAt, 10))
    builder = builder
      .where('post.indexedAt < :indexedAtDate', { indexedAtDate })
      .orWhere((qb) => qb.where('post.indexedAt = :indexedAtDate', { indexedAtDate }))
      .where('post.cid < :cid', { cid })
  }
  const res = await builder.getMany()

  const feed = res.map((row) => ({
    post: row.uri,
  }))

  let cursor: string | undefined
  const last = res.at(-1)
  if (last) {
    cursor = `${new Date(last.indexedAt).getTime()}::${last.cid}`
  }

  return {
    cursor,
    feed,
  }
}
