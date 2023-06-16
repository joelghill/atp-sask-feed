import { Controller } from '@/controller.js'
import {
  QueryParams,
  OutputSchema as AlgoOutput,
} from '../lexicon/types/app/bsky/feed/getFeedSkeleton.js'
import * as flatlanders from './flatlanders.js'

type AlgoHandler = (controller: Controller, params: QueryParams) => Promise<AlgoOutput>

function getAlgos(): Record<string, AlgoHandler> {
  return {
    [flatlanders.shortname]: flatlanders.handler,
  }
}

export default getAlgos
