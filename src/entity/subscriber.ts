/** Containes a class definiton of a community member entity */

import { BaseEntity, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Subscriber extends BaseEntity {
  @PrimaryColumn()
  did: string

  @CreateDateColumn()
  indexedAt: Date

  @UpdateDateColumn()
  lastUpdated: Date
}