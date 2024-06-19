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
    const listWithMoreThanOneBlog = [
        {
            "author": "JABSS",
            "url": "www.testuploadbloggg.com",
            "likes": 3,
            "title": "test lagi 3231321321",
            "id": "6671b7adf198a684059c9f07"
        },
        {
            "author": "HOREYharahereyy",
            "url": "www.uploadtestffortodayy.com",
            "likes": 20,
            "title": "testtukarnama",
            "id": "6672f1a6551c99e7351ebfa9"
        },
        {
            "title": "testlagilagi",
            "author": "jabsszsz",
            "url": "www.eqweqw123.com",
            "likes": 6,
            "id": "6672fcaecc5aae16ed38a083"
        },
        {
            "title": "test lagi add",
            "author": "test add dluuu",
            "url": "www.testaddlagi.com",
            "likes": 13,
            "id": "6672fd98cc5aae16ed38a08a"
        },
        {
            "title": "test lagi 3231321321",
            "author": "jabs",
            "url": "www.fullstackopen-part4.com",
            "likes": 30,
            "id": "6672ff67cc5aae16ed38a09c"
        }
    ]

    const listWithOneBlog = [
        {
            "author": "JABSS",
            "url": "www.testuploadbloggg.com",
            "likes": 3,
            "title": "test lagi 3231321321",
            "id": "6671b7adf198a684059c9f07"
        }
    ]

    const emptyList = [];

    test('of empty list is zero', () => {
        const result = listHelper.totalLikes(emptyList)
        assert.strictEqual(result, 0)
    })
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 3)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(listWithMoreThanOneBlog)
        assert.strictEqual(result, 72)
      })
})