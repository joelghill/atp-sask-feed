import { Post } from './entity/post.js'
import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos.js'
import { OperationsByType } from './operations.js'
import { FirehoseSubscriptionBase } from './util/subscription.js'

export class FirehoseSubscription extends FirehoseSubscriptionBase {
  async handleEvent(evt: RepoEvent) {
    if (!isCommit(evt)) return
    const ops = await OperationsByType.fromCommit(evt)

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
      .map((create) => Post.fromRecord(create))

    if (postsToDelete.length > 0) {
      await this.controller.deletePosts(postsToDelete)
    }
    if (postsToCreate.length > 0) {
      this.controller.addPosts(postsToCreate)
    }
  }
}
