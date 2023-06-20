import FeedGenerator from './server.js'
import { getDataSource } from './datasource/definitions.js'
import { Controller } from './controller.js'
import { getConfig } from './config.js'

/**
 * Runs the feed generator.
 * Loads the configuration, connects to the database, and starts the server.
 */
const run = async () => {
  const config = getConfig()
  console.log('Initializing database')
  const db = await getDataSource(config)
  console.log('Initializing controller')
  const controller = new Controller(db)

  console.log('Initializing server')
  const server = FeedGenerator.create(controller, config)
  console.log('Starting server')
  await server.start()
  console.log(
    `🤖 running feed generator at http://${server.cfg.listenhost}:${server.cfg.port}`,
  )
}

run()
