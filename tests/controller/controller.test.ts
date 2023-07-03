import { DataSource } from 'typeorm'
import { Controller } from '../../src/controller'
import { getTestDataSource } from '../../src/datasource/definitions'
import { Flatlander } from '../../src/entity/flatlander'
import { Post } from '../../src/entity/post'

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

test('Should be able to query posts', async () => {
  // Create a series of mock posts
  const post1 = new Post()
  post1.uri = 'test1'
  post1.cid = 'cid1'
  post1.author = 'author_1'
  // set indexedAt to a date in the past
  post1.indexedAt = new Date(2020, 1, 1)

  const post2 = new Post()
  post2.uri = 'test2'
  post2.cid = 'cid2'
  post2.author = 'author_3'
  post2.indexedAt = new Date(2020, 1, 2)

  const post3 = new Post()
  post3.uri = 'test3'
  post3.cid = 'cid3'
  post3.author = 'author_2'
  //set indexedAt to a date in the "future"
  post3.indexedAt = new Date(2024, 1, 1)

  const posts = [post1, post2, post3]

  const controller = new Controller(db)
  await controller.addPosts(posts)

  const queriedPosts = controller.getPostQueryBuilder(2)
  const res = await queriedPosts.getMany()
  expect(res).toBeDefined()
  expect(res.length).toBe(2)
})

test('Should be able to query past posts', async () => {
  // Create a series of mock posts
  const post1 = new Post()
  post1.uri = 'test1'
  post1.cid = 'cid1'
  post1.author = 'author_1'
  // set indexedAt to a date in the past
  post1.indexedAt = new Date(2020, 1, 1)

  const post2 = new Post()
  post2.uri = 'test2'
  post2.cid = 'cid2'
  post2.author = 'author_3'
  post2.indexedAt = new Date(2020, 1, 2)


  const post3 = new Post()
  post3.uri = 'test3'
  post3.cid = 'cid3'
  post3.author = 'author_2'
  //set indexedAt to a date in the "future"
  post3.indexedAt = new Date(2024, 1, 1)


  const posts = [post1, post2, post3]

  const controller = new Controller(db)
  await controller.addPosts(posts)

  const queriedPosts = controller.filterByIndexedAt(new Date(2023, 1, 1), 10)
  const res = await queriedPosts.getMany()
  expect(res).toBeDefined()
  expect(res.length).toBe(2)
})
