import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class SubState extends BaseEntity {
  @PrimaryColumn()
  service: string

  @Column('integer')
  cursor: number
}
