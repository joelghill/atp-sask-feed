import { cborToLexRecord, readCar } from '@atproto/repo'
import { BlobRef } from '@atproto/lexicon'
import { ids, lexicons } from './lexicon/lexicons.js'
import { Record as PostRecord } from './lexicon/types/app/bsky/feed/post.js'
import { Record as RepostRecord } from './lexicon/types/app/bsky/feed/repost.js'
import { Record as LikeRecord } from './lexicon/types/app/bsky/feed/like.js'
import { Record as FollowRecord } from './lexicon/types/app/bsky/graph/follow.js'
import { Commit } from './lexicon/types/com/atproto/sync/subscribeRepos.js'

export type Operations<T = Record<string, unknown>> = {
  creates: CreateOp<T>[]
  deletes: DeleteOp[]
}

export type CreateOp<T> = {
  uri: string
  cid: string
  author: string
  record: T
}

export type DeleteOp = {
  uri: string
}

export class OperationsByType {
  public posts: Operations<PostRecord>
  reposts: Operations<RepostRecord>
  likes: Operations<LikeRecord>
  follows: Operations<FollowRecord>

  constructor() {
    this.posts = { creates: [], deletes: [] }
    this.reposts = { creates: [], deletes: [] }
    this.likes = { creates: [], deletes: [] }
    this.follows = { creates: [], deletes: [] }
  }

  public static async fromCommit(commit: Commit): Promise<OperationsByType> {
    const ops = new OperationsByType()
    await ops.initFromCommit(commit)
    return ops
  }

  private async initFromCommit(commit: Commit) {
    const car = await readCar(commit.blocks)

    for (const op of commit.ops) {
      const uri = `at://${commit.repo}/${op.path}`
      const [collection] = op.path.split('/')

      if (op.action === 'update') continue // updates not supported yet

      if (op.action === 'create') {
        if (!op.cid) continue
        const recordBytes = car.blocks.get(op.cid)
        if (!recordBytes) continue
        const record = cborToLexRecord(recordBytes)
        const create = { uri, cid: op.cid.toString(), author: commit.repo }
        if (
          collection === ids.AppBskyFeedPost &&
          OperationsByType.isPost(record)
        ) {
          this.posts.creates.push({ record, ...create })
        } else if (
          collection === ids.AppBskyFeedRepost &&
          OperationsByType.isRepost(record)
        ) {
          this.reposts.creates.push({ record, ...create })
        } else if (
          collection === ids.AppBskyFeedLike &&
          OperationsByType.isLike(record)
        ) {
          this.likes.creates.push({ record, ...create })
        } else if (
          collection === ids.AppBskyGraphFollow &&
          OperationsByType.isFollow(record)
        ) {
          this.follows.creates.push({ record, ...create })
        }
      }

      if (op.action === 'delete') {
        if (collection === ids.AppBskyFeedPost) {
          this.posts.deletes.push({ uri })
        } else if (collection === ids.AppBskyFeedRepost) {
          this.reposts.deletes.push({ uri })
        } else if (collection === ids.AppBskyFeedLike) {
          this.likes.deletes.push({ uri })
        } else if (collection === ids.AppBskyGraphFollow) {
          this.follows.deletes.push({ uri })
        }
      }
    }
  }

  public static isPost(obj: unknown): obj is PostRecord {
    return OperationsByType.isType(obj, ids.AppBskyFeedPost)
  }

  public static isRepost = (obj: unknown): obj is RepostRecord => {
    return OperationsByType.isType(obj, ids.AppBskyFeedRepost)
  }

  public static isLike = (obj: unknown): obj is LikeRecord => {
    return OperationsByType.isType(obj, ids.AppBskyFeedLike)
  }

  public static isFollow = (obj: unknown): obj is FollowRecord => {
    return OperationsByType.isType(obj, ids.AppBskyGraphFollow)
  }

  private static isType = (obj: unknown, nsid: string) => {
    try {
      lexicons.assertValidRecord(nsid, OperationsByType.fixBlobRefs(obj))
      return true
    } catch (err) {
      return false
    }
  }

  // @TODO right now record validation fails on BlobRefs
  // simply because multiple packages have their own copy
  // of the BlobRef class, causing instanceof checks to fail.
  // This is a temporary solution.
  private static fixBlobRefs = (obj: unknown): unknown => {
    if (Array.isArray(obj)) {
      return obj.map(OperationsByType.fixBlobRefs)
    }
    if (obj && typeof obj === 'object') {
      if (obj.constructor.name === 'BlobRef') {
        const blob = obj as BlobRef
        return new BlobRef(blob.ref, blob.mimeType, blob.size, blob.original)
      }
      return Object.entries(obj).reduce((acc, [key, val]) => {
        return Object.assign(acc, { [key]: OperationsByType.fixBlobRefs(val) })
      }, {} as Record<string, unknown>)
    }
    return obj
  }
}
