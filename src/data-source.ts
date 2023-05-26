
import { DataSource } from 'typeorm'
import AdminJS from 'adminjs'
import * as AdminJSTypeorm from '@adminjs/typeorm'
import { Post } from './entity/post.js'
import { SubState } from './entity/sub-state.js'
import { Subscriber } from './entity/subscriber.js'
import { Config } from './config.js'
import { Session } from './entity/session.js'

AdminJS.registerAdapter({
  Resource: AdminJSTypeorm.Resource,
  Database: AdminJSTypeorm.Database,
})

/**
 * Gets an initialized DataSource instance based on the provided config.
 * @param config The configuration.
 * @returns An initialized DataSource instance.
 */
export async function getDataSource(config: Config): Promise<DataSource> {
  let db: DataSource | undefined = undefined
  if (config.dbType === 'sqlite') {
    db = new DataSource({
      type: 'sqlite',
      database: config.sqliteLocation,
      entities: [Post, SubState, Subscriber, Session],
      synchronize: true,
    })
  }
  if (config.dbType === 'postgres') {
    db = new DataSource({
      type: 'postgres',
      host: config.dbHost,
      port: config.dbPort,
      username: config.dbUsername,
      password: config.dbPassword,
      database: config.dbName,
      entities: [Post, SubState, Subscriber],
      synchronize: true,
    })
  }

  if (db) {
    await db.initialize()
    return db
  }

  throw new Error(`Unknown database type: ${config.dbType}`)
}


export async function getTestDataSource(): Promise<DataSource> {
  const db = new DataSource({
    type: 'better-sqlite3',
    database: ':memory:',
    entities: [Post, SubState, Subscriber, Session],
    synchronize: true,
  })
  await db.initialize()
  return db
}