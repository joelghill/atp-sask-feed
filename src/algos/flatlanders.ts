import { InvalidRequestError } from '@atproto/xrpc-server'
import { QueryParams } from '../lexicon/types/app/bsky/feed/getFeedSkeleton.js'
import { Controller } from '@/controller.js'
import { Record as PostRecord } from '../lexicon/types/app/bsky/feed/post.js'
import { CreateOp } from '@/operations.js'
import { Post } from '../entity/post.js'
import { SaskKeyword, saskKeywords } from './keywords.js'
import { Flatlander } from '../entity/flatlander.js'

export const shortname = 'flatlanders'

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
 * Scores a post based on the text matching keywords.
 * Iterates through the keywords and for each keyword found in the text it adds the keyword's score to the post's score.
 * If the text matches any excluded keywords, the post is not scored.
 * @param text The text to score.
 */
export const getKeywordMatch = (text: string): SaskKeyword | null => {
  text = text.toLowerCase()

  for (const keyword of saskKeywords) {
    if (new RegExp('(\\b' + keyword.text + '\\b)').test(text)) {
      return keyword
    }
  }
  return null
}

/**
 * Function to take post creation records and return the posts to add to the database.
 */
export const recordPosts = async (
  createRecords: CreateOp<PostRecord>[],
  controller: Controller,
  threshhold: number,
) => {
  const posts: Post[] = []
  for (const record of createRecords) {
    // Match keyword entry with post text
    let keyword = getKeywordMatch(record.record.text)
    if (keyword && keyword.toFeed) {
      console.log(`Post added via keyword: ${record.record.text}.`)
      posts.push(Post.fromRecord(record))
    }

    let flatlander = await controller.getFlatlander(record.author)
    if (flatlander) {
      if (keyword && keyword?.boostAuthor) {
        flatlander.score += 1
        // save flatlander
        await controller.saveFlatlander(flatlander)
      }

      // If there is a tracked person that meets the post threshold
      // and the post would otherwise be ignored, add it to the feed.
      if (!keyword?.toFeed && flatlander.isSask(threshhold)) {
        // If it is a reply, check if the parent is a recorded post.
        if (record.record.reply) {
          const isReplyingToSaskPost = await controller.hasPost(
            record.record.reply.parent.uri,
          )
          // If it is, add the reply to the feed.
          if (isReplyingToSaskPost) {
            console.log(
              'Post added via reply to flatlander post: ',
              record.record.text,
            )
            posts.push(Post.fromRecord(record))
          }
        } else {
          console.log('Post added via flatlander post: ', record.record.text)
          posts.push(Post.fromRecord(record))
        }
      }
    } else if (keyword?.boostAuthor) {
      // make new flatlander and save
      flatlander = new Flatlander()
      flatlander.did = record.author
      flatlander.score = 1
      // save flatlander
      await controller.saveFlatlander(flatlander)
    }
  }
  await controller.addPosts(posts)
}
