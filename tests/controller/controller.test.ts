import { DataSource } from 'typeorm'
import { Controller } from '../../src/controller'
import { getTestDataSource } from '../../src/datasource/definitions'
import { Flatlander } from '../../src/entity/flatlander'

let db: DataSource

beforeEach(async () => {
  db = await getTestDataSource()
})

afterEach(async () => {
  await db.destroy()
})

test('Should be able to construct a controller with a db', async () => {
  const controller = new Controller(db)
  expect(controller).toBeDefined()
})

test('Should be able to save a flatlander', async () => {
  const controller = new Controller(db)
  let flatlander: Flatlander | null = new Flatlander()
  flatlander.did = 'test'
  flatlander.score = 1
  await controller.saveFlatlander(flatlander)
  flatlander = await controller.getFlatlander('test')

  expect(flatlander).toBeDefined()
  expect(flatlander?.score).toBe(1)
})
