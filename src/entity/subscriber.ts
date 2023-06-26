/** Containes a class definiton of a subsciber member entity */

import {
  BaseEntity,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Subscriber extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  did: string

  @CreateDateColumn()
  indexedAt: Date

  @UpdateDateColumn()
  lastUpdated: Date

  @Column({ type: 'date', nullable: true })
  expiresAt: Date | null
}
