import { AppContext } from '../config.js'
import {
  QueryParams,
  OutputSchema as AlgoOutput,
} from '../lexicon/types/app/bsky/feed/getFeedSkeleton.js'
import * as whatsAlf from './whats-alf.js'

type AlgoHandler = (ctx: AppContext, params: QueryParams) => Promise<AlgoOutput>

const algos: Record<string, AlgoHandler> = {
  [whatsAlf.uri]: whatsAlf.handler,
}

export default algos
