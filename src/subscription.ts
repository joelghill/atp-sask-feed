import { recordPosts } from './algos/flatlanders.js'
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
    
    const postsToDelete = ops.posts.deletes.map((del) => del.uri)
    if (postsToDelete.length > 0) {
      await this.controller.deletePosts(postsToDelete)
    }

    recordPosts(ops.posts.creates, this.controller)
  }
}
