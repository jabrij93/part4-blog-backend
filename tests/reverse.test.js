const { test, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helper')
const listHelper = require('../utils/list_helper')
const totalLikes = require('../utils/list_helper').totalLikes
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = listHelper.totalLikes(helper.emptyList)
        assert.strictEqual(result, 0)
    })
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(helper.onlyOneBlog)
      assert.strictEqual(result, 3)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(helper.initialBlogs)
        assert.strictEqual(result, 29)
      })
})