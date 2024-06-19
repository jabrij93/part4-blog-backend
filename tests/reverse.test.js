const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const totalLikes = require('../utils/list_helper').totalLikes

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
    const listWithOneBlog = [
      {
        "author": "HOREYharahereyy",
        "url": "www.uploadtestffortodayy.com",
        "likes": 20,
        "title": "testtukarnama",
        "id": "6672f1a6551c99e7351ebfa9"
      }
    ]
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 20)
    })
  })