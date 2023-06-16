import { Controller } from '@/controller.js'
import { AppContext } from '../config.js'
import {
  QueryParams,
  OutputSchema as AlgoOutput,
} from '../lexicon/types/app/bsky/feed/getFeedSkeleton.js'
import * as flatlanders from './flatlanders.js'

type AlgoHandler = (controller: Controller, params: QueryParams) => Promise<AlgoOutput>

function getAlgos(ctx: AppContext): Record<string, AlgoHandler> {
  return {
    [flatlanders.uri(ctx.cfg.serviceDid)]: flatlanders.handler,
  }
}

export default getAlgos
