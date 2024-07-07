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

test('blogs are returned as json', async () => {
  console.log('entered test')
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

  console.log('DATA IN API: ', response.body);
})

test('blogs are returned as json and have id field', async () => {
  console.log('entered test')
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  console.log('DATA IN API: ', response.body);

  const blogs = response.body
  blogs.forEach(blog => {
    assert.ok(blog.id, 'Blog should have id field')
    assert.strictEqual(blog._id, undefined, 'Blog should not have _id field')
  })
})

test.only('verifies http POST successfully creates a new blog post', async () => {
  console.log('entered test')
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  console.log('DATA IN API: ', response.body);

  const blogs = response.body
  const blogsId = blogs.map(blog => parseInt(blog.id, 16))
  const maxBlogId = Math.max(...blogsId)
  console.log("BLOGS ID", maxBlogId);
  // blogs.forEach(blog => {
  //   assert.ok(blog.id, 'Blog should have id field')
  //   assert.strictEqual(blog._id, undefined, 'Blog should not have _id field')
  // })
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