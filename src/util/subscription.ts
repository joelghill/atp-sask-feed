import { Subscription } from '@atproto/xrpc-server'
import { ids, lexicons } from '../lexicon/lexicons.js'
import {
  OutputSchema as RepoEvent,
  isCommit,
} from '../lexicon/types/com/atproto/sync/subscribeRepos.js'
import { Controller } from '../controller.js'
import { AppContext } from '../config.js'

export abstract class FirehoseSubscriptionBase {
  public sub: Subscription<RepoEvent>
  protected service: string
  protected controller: Controller

  constructor(protected context: AppContext) {
    this.controller = context.controller
    this.service = context.cfg.subscriptionEndpoint

    this.sub = new Subscription({
      service: this.context.cfg.subscriptionEndpoint,
      method: ids.ComAtprotoSyncSubscribeRepos,
      getParams: () => this.context.controller.getCursor(this.service),
      validate: (value: unknown) => {
        try {
          return lexicons.assertValidXrpcMessage<RepoEvent>(
            ids.ComAtprotoSyncSubscribeRepos,
            value,
          )
        } catch (err) {
          console.error('repo subscription skipped invalid message', err)
        }
      },
    })
  }

  abstract handleEvent(evt: RepoEvent): Promise<void>

  async run() {
    for await (const evt of this.sub) {
      try {
        await this.handleEvent(evt)
      } catch (err) {
        console.error('repo subscription could not handle message', err)
      }
      // update stored cursor every 20 events or so
      if (isCommit(evt) && evt.seq % 20 === 0) {
        this.controller.updateCursor(this.service, evt.seq)
      }
    }
  }
}
