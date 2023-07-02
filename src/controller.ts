import { DataSource, Repository, In, MoreThanOrEqual, IsNull } from 'typeorm'
import { Post } from './entity/post.js'
import { SubState } from './entity/sub-state.js'
import { Subscriber } from './entity/subscriber.js'
import { SelectQueryBuilder } from 'typeorm'
import { Session } from './entity/session.js'
import { Flatlander } from './entity/flatlander.js'
import { TypeormStore } from 'connect-typeorm'

/** Controller class servs as an interface with the db */
export class Controller {
  private posts: Repository<Post>
  private subStates: Repository<SubState>
  private subscribers: Repository<Subscriber>
  private flatlanders: Repository<Flatlander>
  private sessions: Repository<Session>
  public sessionStore: TypeormStore

  /**
   * Constructs a new controller.
   * @param db The database to use.
   */
  constructor(private db: DataSource) {
    this.subStates = this.db.getRepository(SubState)
    this.posts = this.db.getRepository(Post)
    this.subscribers = this.db.getRepository(Subscriber)
    this.flatlanders = this.db.getRepository(Flatlander)
    this.sessions = this.db.getRepository(Session)
    this.sessionStore = new TypeormStore({
      cleanupLimit: 2,
      ttl: 86400,}).connect(this.sessions)

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
  filterByIndexedAt(
    query: SelectQueryBuilder<Post>,
    indexedAt: Date,
    limit: number,
  ) {
    return (
      query
        .where('post.indexedAt < :indexedAt', { indexedAt: indexedAt })
        .orWhere((qb) =>
          qb.where('post.indexedAt = :indexedAt', { indexedAt: indexedAt }),
        )
        .orderBy('post.indexedAt', 'DESC')
        .limit(limit)
    )
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
   * Checks to see if a post exists in the database.
   * @param uri 
   * @returns True if the post exists, false otherwise.
   */
  async hasPost(uri: string): Promise<boolean> {
    const post = await this.posts.findOneBy({ uri })
    return !!post
  }

  /**
   * Updates a cursor state for a given service.
   * @param service The service to update the cursor for.
   * @param cursor The new cursor value.
   */
  async updateCursor(service: string, cursor: number) {
    const state = new SubState()
    state.service = service
    state.cursor = cursor
    this.subStates.save(state)
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

  /**
   * Gets a flatlander by did.
   * @param did The did to get the flatlander for. Must have score above or equal to threshhold.
   * @returns The subscriber or null if not found.
   */
  async getFlatlander(did: string): Promise<Flatlander | null> {
    return await this.flatlanders.findOneBy({ did: did })
  }

  /**
   * Saves a flatlander to the database.
   */
  async saveFlatlander(flatlander: Flatlander) {
    await this.flatlanders.save(flatlander)
  }
}
