import { DataSource } from 'typeorm'
import { DidResolver } from '@atproto/did-resolver'
import { Controller } from './controller.js'

export type AppContext = {
  controller: Controller
  didResolver: DidResolver
  cfg: Config
}

export type Config = {
  port: number
  hostname: string
  sqliteLocation: string
  subscriptionEndpoint: string
  serviceDid: string
}
