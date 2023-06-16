import { Record as PostRecord } from '../lexicon/types/app/bsky/feed/post.js'
import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm'
import { CreateOp } from '../operations.js'

@Entity()
export class Post extends BaseEntity {
  @PrimaryColumn()
  uri: string

  @Column()
  cid: string

  @Column()
  author: string

  @Column({ type: String, nullable: true })
  replyParent: string | null

  @Column({ type: String, nullable: true })
  replyRoot: string | null

  @Column()
  indexedAt: Date

  /**
   * Instantiates a Post from a CreateOp<PostRecord>
   * @param create The CreateOp<PostRecord> to instantiate from
   * @returns A new Post instance
   */
  static fromRecord(create: CreateOp<PostRecord>) {
    const post = new Post()
    post.uri = create.uri
    post.cid = create.cid
    post.author = create.author
    post.replyParent = create.record?.reply?.parent.uri ?? null
    post.replyRoot = create.record?.reply?.root.uri ?? null
    post.indexedAt = new Date()

    return post
  }
}
