import FeedGenerator from './server.js'
import datasource  from './datasource/default.js'
import { Controller } from './controller.js'
import { getConfig } from './config.js'


const db = await datasource.initialize()

/**
 * Runs the feed generator.
 * Loads the configuration, connects to the database, and starts the server.
 */
const run = async () => {
  const config = getConfig()
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
