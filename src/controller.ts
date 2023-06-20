import { DataSource, Repository, In, MoreThanOrEqual, IsNull } from 'typeorm'
import { Post } from './entity/post.js'
import { SubState } from './entity/sub-state.js'
import { Subscriber } from './entity/subscriber.js'
import { SelectQueryBuilder } from 'typeorm'
import { Session } from './entity/session.js'
import typeormStore from 'typeorm-store'

/** Controller class servs as an interface with the db */
export class Controller {
  private posts: Repository<Post>
  private subStates: Repository<SubState>
  private subscribers: Repository<Subscriber>
  private sessionStore: typeormStore.TypeormStore

  /**
   * Constructs a new controller.
   * @param db The database to use.
   */
  constructor(private db: DataSource) {
    this.subStates = this.db.getRepository(SubState)
    this.posts = this.db.getRepository(Post)
    this.subscribers = this.db.getRepository(Subscriber)
    this.sessionStore = new typeormStore.TypeormStore({
      repository: this.db.getRepository(Session),
    })
  }

  /**
   * Gets the session store.
   */
  get session() {
    return this.sessionStore
  }

  /**
   * Gets a query for posts ordered by indexedAt and cid descending with a limit.
   * @param limit The limit to apply to the query.
   * @returns An instance of SelectQueryBuilder<Post>.
   */
  getPostQueryBuilder(limit: number) {
    return this.posts
      .createQueryBuilder('post')
      .orderBy('post.indexedAt', 'DESC')
      .limit(limit)
  }

  /**
   * Filters a posts query by index date and cid.
   * @param query The query to filter.
   * @param cid The cid to filter by.
   * @param indexedAt The indexedAt date to filter by.
   * @returns The filtered query.
   */
  filterByCidOrIndexedAt(
    query: SelectQueryBuilder<Post>,
    cid: string,
    indexedAt: Date,
  ) {
    return query
      .where('post.indexedAt < :indexedAtDate', { indexedAt })
      .orWhere((qb) =>
        qb.where('post.indexedAt = :indexedAtDate', { indexedAt }),
      )
      .where('post.cid < :cid', { cid })
      .orderBy('post.indexedAt', 'DESC')
  }

  /**
   * Deletes posts with the provided uris.
   * @param postUris - The uris of the posts to delete.
   */
  async deletePosts(postUris: string[]) {
    this.posts.delete({ uri: In(postUris) })
  }

  /**
   * Adds posts to the database.
   * @param posts Posts to add to the database.
   */
  async addPosts(posts: Post[]) {
    this.posts.insert(posts)
  }

  /**
   * Updates a cursor state for a given service.
   * @param service The service to update the cursor for.
   * @param cursor The new cursor value.
   */
  async updateCursor(service: string, cursor: number) {
    this.subStates.update({ service }, { cursor })
  }

  /**
   * Gets the cursor for a given service.
   * @param service The service to get the cursor for.
   * @returns The cursor for the given service.
   */
  async getCursor(service: string): Promise<{ cursor?: number }> {
    const res = await this.subStates.findOneBy({ service })
    return res ? { cursor: res.cursor } : {}
  }

  /**
   * Saves a subscriber to the database.
   * @param sub
   */
  async saveSubscriber(did: string, noExpiry: boolean = false) {

    let sub = await this.subscribers.findOneBy({ did })
    if (!sub) {
      sub = new Subscriber()
      sub.did = did
    }
    if (noExpiry) {
      sub.expiresAt = null
    } else {
      // Set expirey to 1 week from now
      sub.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
    this.subscribers.save(sub)
  }

  async subscriberExists(did: string): Promise<boolean> {
    // Find subscriber by did and if the expiresAt is null or less than now
    return (
      (await this.subscribers.findOneBy([
        { did, expiresAt: IsNull() },
        { did, expiresAt: MoreThanOrEqual(new Date()) },
      ])) != null
    )
  }
}
