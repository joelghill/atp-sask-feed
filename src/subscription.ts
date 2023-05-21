import { Post } from './entity/post.js'
import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos.js'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription.js'
import { In } from 'typeorm'

export class FirehoseSubscription extends FirehoseSubscriptionBase {
  async handleEvent(evt: RepoEvent) {
    if (!isCommit(evt)) return
    const ops = await getOpsByType(evt)

    // This logs the text of every post off the firehose.
    // Just for fun :)
    // Delete before actually using
    for (const post of ops.posts.creates) {
      console.log(post.record.text)
    }

    const postsToDelete = ops.posts.deletes.map((del) => del.uri)
    const postsToCreate = ops.posts.creates
      .filter((create) => {
        // only alf-related posts
        return create.record.text.toLowerCase().includes('alf')
      })
      .map((create) => {
        // map alf-related posts to a db row
        const post = new Post()
        post.uri = create.uri
        post.cid = create.cid
        post.replyParent = create.record?.reply?.parent.uri ?? null
        post.replyRoot = create.record?.reply?.root.uri ?? null
        post.indexedAt = new Date() 
        return post    
      })

    if (postsToDelete.length > 0) {
      await this.posts.delete({ uri: In(postsToDelete) })
    }
    if (postsToCreate.length > 0) {
      this.posts.save(postsToCreate)
    }
  }
}
