import { Controller } from '../../src/controller'
import { getTestDataSource } from '../../src/data-source'

test('Should be able to construct a controller with a db', async () => {
  const db = await getTestDataSource()
  const controller = new Controller(db)
  expect(controller).toBeDefined()
  await db.destroy()
})
