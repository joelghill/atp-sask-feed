import { DataSource, DataSourceOptions } from 'typeorm'
import { Post } from '../entity/post.js'
import { SubState } from '../entity/sub-state.js'
import { Subscriber } from '../entity/subscriber.js'
import { Config } from '../config.js'
import { Session } from '../entity/session.js'


/**
 * Gets an initialized DataSource instance based on the provided config.
 * @param config The configuration.
 * @returns An initialized DataSource instance.
 */
export async function getDataSource(
  config: Config,
): Promise<DataSource> {
  let db: DataSource | undefined = undefined
  let dbConfig: DataSourceOptions | undefined = undefined

  if (config.dbType === 'sqlite') {
    db = new DataSource({
      type: 'better-sqlite3',
      database: config.sqliteLocation,
      entities: [Post, SubState, Subscriber, Session],
      synchronize: true,
    })
  }
  if (config.dbType === 'postgres') {
    // If db URL in config, use it
    dbConfig = {
      type: 'postgres',
      url: config.dbUrl,
      entities: [Post, SubState, Subscriber, Session],
      migrations: ['src/migrations/*.ts'],
      migrationsRun: true,
      ssl: {
        rejectUnauthorized: true,
        ca: config.dbSSLCert,
      },
    } as DataSourceOptions
    
    db = new DataSource(dbConfig)
  }

  if (!db) {
    throw new Error(`Unknown database type: ${config.dbType}`)
  }

  return db
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
