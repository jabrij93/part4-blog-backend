const { test, describe, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const assert = require('node:assert')
const helper = require('./test_helper')
const listHelper = require('../utils/list_helper')
const totalLikes = require('../utils/list_helper').totalLikes
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

  console.log('Promise Array', promiseArray)
})

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

test.only('blogs are returned as json', async () => {
  console.log('entered test')
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
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
        assert.strictEqual(result, 39)
      })
})

after(async () => {
  await mongoose.connection.close()
})