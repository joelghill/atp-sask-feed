import dotenv from 'dotenv'
import FeedGenerator from './server.js'
import AdminJS from 'adminjs'
import * as AdminJSTypeorm from '@adminjs/typeorm'
import { sqliteDatSource } from './data-source.js'

AdminJS.registerAdapter({
  Resource: AdminJSTypeorm.Resource,
  Database: AdminJSTypeorm.Database,
})

const run = async () => {
  dotenv.config()

  const db = sqliteDatSource
  await db
    .initialize()
    .then(() => {
      console.log('🤖 db initialized')
    })
    .catch((err) => {
      console.log(err)
    })

  const hostname = maybeStr(process.env.FEEDGEN_HOSTNAME) ?? 'example.com'
  const serviceDid =
    maybeStr(process.env.FEEDGEN_SERVICE_DID) ?? `did:web:${hostname}`
  const server = FeedGenerator.create(db, {
    port: maybeInt(process.env.FEEDGEN_PORT) ?? 3000,
    sqliteLocation: maybeStr(process.env.FEEDGEN_SQLITE_LOCATION) ?? ':memory:',
    subscriptionEndpoint:
      maybeStr(process.env.FEEDGEN_SUBSCRIPTION_ENDPOINT) ??
      'wss://bsky.social',
    hostname,
    serviceDid,
  })
  await server.start()
  console.log(
    `🤖 running feed generator at http://localhost:${server.cfg.port}`,
  )
}

const maybeStr = (val?: string) => {
  if (!val) return undefined
  return val
}

const maybeInt = (val?: string) => {
  if (!val) return undefined
  const int = parseInt(val, 10)
  if (isNaN(int)) return undefined
  return int
}

run()
