import { getKeywordMatch } from '../../src/algos/flatlanders'

test('Text should match algo', async () => {
  const match = getKeywordMatch('I am a saskatchewanian')
  expect(match?.text).toEqual('saskatchewanian')
})

test('SK Text should not match algo', async () => {
  const text =
    "Here's a first post on BlueSky (and thanks for building an escape!), appropriately enough pointing to a blue sky rethink of data privacy. https://medium.lessig.org/on-being-a-skunk-at-a-data-privacy-conference-e95671e05ed6?sk=0dc800c4ee5c711e8193b703fb02f582"
  const match = getKeywordMatch(text)
  expect(match).toEqual(null)
})

test('Melville text should have a score of 1', async () => {
  const text =
    '"Melville transmuted death into life in Moby-Dick. He has a coffin save Ishmael. McCarthy, at the end of Blood Meridian, stands that coffin upright and turns it into an outhouse." Wonderful piece from Greg Grandin\nhttps://www.thenation.com/article/culture/cormac-mccarthy-obit-melville/'
  expect(getKeywordMatch(text)).toEqual(null)
})