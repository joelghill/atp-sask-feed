import dotenv from 'dotenv'
import express from 'express'
import { DidResolver } from '@atproto/did-resolver'
import { Controller } from './controller.js'
import { Server } from './lexicon/index.js'

/**
 * The app context.
 */
export type AppContext = {
  currentApp: express.Application
  atp: Server
  controller: Controller
  didResolver: DidResolver
  cfg: Config
}

/**
 * The app configuration.
 */
export type Config = {
  port: number
  listenhost: string
  hostname: string
  dbType: string
  dbHost: string
  dbPort: number
  dbUsername: string
  dbPassword: string
  dbName: string
  sqliteLocation: string
  subscriptionEndpoint: string
  serviceDid: string
  adminDid: string
  publisherDid: string
  subscriptionReconnectDelay: number
}

/**
 * Helper function to get a string from an environment variable, or undefined if the variable is not set.
 * @param val The environment variable to get.
 * @returns The string, or undefined if the variable is not set.
 */
const maybeStr = (val?: string) => {
  if (!val) return undefined
  return val
}

/**
 * Get an integer from a string, or undefined if the string is not an integer.
 * @param val The string to parse.
 * @returns The integer, or undefined if the string is not an integer.
 */
const maybeInt = (val?: string) => {
  if (!val) return undefined
  const int = parseInt(val, 10)
  if (isNaN(int)) return undefined
  return int
}

/**
 * Gets the app configuration from the environment
 * @returns A new Config instance.
 */
export const getConfig = (): Config => {
  dotenv.config()

  const hostname = maybeStr(process.env.FEEDGEN_HOSTNAME) ?? 'feed.flatlander.social'
  const serviceDid =
    maybeStr(process.env.FEEDGEN_SERVICE_DID) ?? `did:web:${hostname}`
  return {
    listenhost: maybeStr(process.env.FEEDGEN_LISTEN_HOST) ?? 'localhost',
    port: maybeInt(process.env.FEEDGEN_PORT) ?? 3000,
    sqliteLocation: maybeStr(process.env.FEEDGEN_SQLITE_LOCATION) ?? 'db.sqlite',
    subscriptionEndpoint:
      maybeStr(process.env.FEEDGEN_SUBSCRIPTION_ENDPOINT) ??
      'wss://bsky.social',
    hostname,
    serviceDid,
    dbType: maybeStr(process.env.FEEDGEN_DB_TYPE) ?? 'sqlite',
    dbHost: maybeStr(process.env.FEEDGEN_DB_HOST) ?? 'localhost',
    dbPort: maybeInt(process.env.FEEDGEN_DB_PORT) ?? 5432,
    dbUsername: maybeStr(process.env.FEEDGEN_DB_USERNAME) ?? 'postgres',
    dbPassword: maybeStr(process.env.FEEDGEN_DB_PASSWORD) ?? 'postgres',
    dbName: maybeStr(process.env.FEEDGEN_DB_NAME) ?? 'feedgen',
    adminDid: maybeStr(process.env.FEEDGEN_ADMIN_DID) ?? '',
    publisherDid: maybeStr(process.env.FEEDGEN_PUBLISHER_DID) ?? '',
    subscriptionReconnectDelay: maybeInt(process.env.FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY) ?? 1000,
  }
}
