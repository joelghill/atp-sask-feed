/** Containes a class definiton of a community member entity */
import {
  BaseEntity,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Flatlander extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  did: string

  @CreateDateColumn()
  indexedAt: Date

  @UpdateDateColumn()
  lastUpdated: Date

  @Column({ type: 'int', default: 0 })
  score: number

  isSask(threshhold: number): boolean {
    // If score is greater than 2 and they were last updated within the last 3 months
    return (
      this.score >= threshhold &&
      this.lastUpdated.getTime() > Date.now() - 3 * 30 * 24 * 60 * 60 * 1000
    )
  }
}
