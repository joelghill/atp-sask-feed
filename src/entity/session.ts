import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { SessionEntity } from 'typeorm-store'

@Entity()
export class Session extends BaseEntity implements SessionEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  expiresAt: number

  @Column()
  data: string
}