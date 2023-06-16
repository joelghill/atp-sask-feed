import { InvalidRequestError } from '@atproto/xrpc-server'
import { QueryParams } from '../lexicon/types/app/bsky/feed/getFeedSkeleton.js'
import { Controller } from '@/controller.js'
import { Record as PostRecord } from '../lexicon/types/app/bsky/feed/post.js'
import { CreateOp } from '@/operations.js'
import { Post } from '../entity/post.js'
import { saskKeywords } from './keywords.js'

export const uri = (did: string) => {
  return `at://${did}/app.bsky.feed.generator/flatlanders`
}

export const handler = async (controller: Controller, params: QueryParams) => {
  let builder = controller.getPostQueryBuilder(params.limit)

  if (params.cursor) {
    const [indexedAt, cid] = params.cursor.split('::')
    if (!indexedAt || !cid) {
      throw new InvalidRequestError('malformed cursor')
    }
    const indexedAtDate = new Date(parseInt(indexedAt, 10))
    builder = controller.filterByCidOrIndexedAt(builder, cid, indexedAtDate)
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

/**
 * Function to take post creation records and return the posts to add to the database.
 */
export const recordPosts = async (
  createRecords: CreateOp<PostRecord>[],
  controller: Controller,
) => {
  // For every post creation record, check if the author exists in subscribers.
  // If they do, add the post to the database.
  const posts: Post[] = []
  const promises: Promise<void>[] = []
  for (const record of createRecords) {
    const promise = controller.subscriberExists(record.author).then((exists) => {
      if (exists) {
        posts.push(Post.fromRecord(record))
        console.log(`Suscriber post: ${record.record.text}`)
      } else if (record.record?.text) {
        // If the author is not a subscriber, check text for keywords
        const text = record.record.text
        const found = saskKeywords.some((keyword) =>
          new RegExp('\\b' + keyword + '\\b')
            .test(text.toLowerCase())
        )
        if (found) {
          console.log(`Keyword match: ${record.record.text}`)
          posts.push(Post.fromRecord(record))
        }
      }
    })
    promises.push(promise)
  }
  await Promise.all(promises)
  controller.addPosts(posts)
}
