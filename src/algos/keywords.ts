/**
 * A keyword that can be used to identify a tweet as being from Saskatchewan.
 * Basic pattern matching is used to identify keywords.
 * Each keyword has a score that quantifies how likely it is that the tweet is from Saskatchewan.
 * Exceptions are text that, if they match, they disqualify the text from matching.
 */
export interface SaskKeyword {
  text: string
  toFeed: boolean
  boostAuthor: boolean
}

// A static array of sask keyword objects
export const saskKeywords: SaskKeyword[] = [
  { text: 'sask', toFeed: true, boostAuthor: true },
  { text: 'saskatchewan', toFeed: true, boostAuthor: true },
  { text: 'saskatoon', toFeed: true, boostAuthor: true },
  { text: 'saskatchatoon', toFeed: true, boostAuthor: true },
  { text: 'saskatchewanians', toFeed: true, boostAuthor: true },
  { text: 'saskatchewanian', toFeed: true, boostAuthor: true },
  { text: 'city of regina', toFeed: true, boostAuthor: true },
  { text: 'regina, sk', toFeed: true, boostAuthor: true },
  { text: 'regina, sask', toFeed: true, boostAuthor: true },
  { text: 'regina sask', toFeed: true, boostAuthor: true },
  { text: 'regina sk', toFeed: true, boostAuthor: true },
  { text: 'yxe', toFeed: true, boostAuthor: true },
  { text: 'yxecc', toFeed: true, boostAuthor: true },
  { text: 'yqr', toFeed: true, boostAuthor: true },
  { text: 'yqrcc', toFeed: true, boostAuthor: true },
  { text: 'skpoli', toFeed: true, boostAuthor: true },
  { text: 'bunny hug', toFeed: true, boostAuthor: true },
  { text: 'bunnyhug', toFeed: true, boostAuthor: true },
  { text: 'bunny-hug', toFeed: true, boostAuthor: true },
  { text: 'land of the living skies', toFeed: true, boostAuthor: true },
  { text: 'western canada', toFeed: true, boostAuthor: false },  
  { text: 'canadian prairies', toFeed: true, boostAuthor: false },
  { text: 'canadian prairie', toFeed: true, boostAuthor: false },
  { text: 'prairie province', toFeed: true, boostAuthor: false },
  { text: 'prairie provinces', toFeed: true, boostAuthor: false },
]
