import { DataSource } from 'typeorm'
import { Controller } from '../../src/controller'
import { getTestDataSource } from '../../src/datasource/definitions'

let db: DataSource

beforeEach(async () => {
  db = await getTestDataSource()
})

afterEach(() => {
  return db.destroy()
})


test('Should be able to construct a controller with a db', async () => {
  const controller = new Controller(db)
  expect(controller).toBeDefined()
})

test('Should be able to construct a controller with a db', async () => {
  const controller = new Controller(db)
  expect(controller).toBeDefined()
})
