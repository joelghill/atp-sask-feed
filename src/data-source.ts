import { DataSource } from 'typeorm'
import { Post } from './entity/post.js'
import { SubState } from './entity/sub-state.js'
import { Subscriber } from './entity/subscriber.js'

// SQLite Datasource
export const sqliteDatSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [Post, SubState, Subscriber],
  synchronize: true,
})
