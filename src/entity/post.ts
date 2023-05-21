import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class Post extends BaseEntity {
  @PrimaryColumn()
  uri: string

  @Column()
  cid: string

  @Column({ type: String, nullable: true })
  replyParent: string | null

  @Column({ type: String, nullable: true })
  replyRoot: string | null

  @Column()
  indexedAt: Date
}
