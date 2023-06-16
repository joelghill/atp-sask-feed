import FeedGenerator from './server.js'
import { getDataSource } from './data-source.js'
import { Controller } from './controller.js'
import { getConfig } from './config.js'

/**
 * Runs the feed generator.
 * Loads the configuration, connects to the database, and starts the server.
 */
const run = async () => {
  const config = getConfig()
  const db = await getDataSource(config)
  const controller = new Controller(db)

  const server = FeedGenerator.create(controller, config)
  await server.start()
  console.log(
    `🤖 running feed generator at http://${server.cfg.listenhost}:${server.cfg.port}`,
  )
}

run()
