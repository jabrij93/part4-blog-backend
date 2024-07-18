const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { test, describe, after, beforeEach } = require('node:test')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const assert = require('node:assert')
const helper = require('./test_helper')
const listHelper = require('../utils/list_helper')
const totalLikes = require('../utils/list_helper').totalLikes
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())

  
  await Promise.all(promiseArray)
})

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
})

test('blogs are returned as json and have id field', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogs = response.body
  blogs.forEach(blog => {
    assert.ok(blog.id, 'Blog should have id field')
    assert.strictEqual(blog._id, undefined, 'Blog should not have _id field')
  })
})

test('if new blogs has no likes property, default it to 0', async () => {
  // Step 1: Get the initial list of blogs
  let response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const initialBlogs = response.body
  const initialCount = initialBlogs.likes

  // Step 2: Create a new blog post
  const newBlog = {
    title: 'Test New Blog Post',
    author: 'test by jabs',
    url: 'http://example.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // Step 3: Get the updated list of blogs
  response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const updatedBlogs = response.body
  const updatedCount = updatedBlogs.likes

  // Verify the count has increased by one
  assert.strictEqual(updatedCount, initialCount)

  console.log('New blog post default to 0 successfully')
})

test('if title or url is missing, 400 error is returned', async () => {
  // Step 1: Get the initial list of blogs
  let response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  // Step 2: Create a new blog post
  const newBlog = {
    author: 'test by jabss',
    url: 'www.testwithurl.com'
  }

  let response2 = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  // Verify error 400 is returned
  assert.ok(response2)

  console.log('title or url missing error detected successfully')
})

describe.only('Creates new blog post', () => {
  test.only('verifies if a token is not provided', async () => {

    const newBlog = {
      title: 'Test New Blog Post',
      author: 'test by jabs',
      url: 'http://example.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
      .expect({ error: 'token not provided' })  // Verifying the error messa
  })

  test.only('create new blog post successful', async () => {

  // Create a new user
  const passwordHash = await bcrypt.hash('test1234', 10)
  const user = new User({
    _id: new mongoose.Types.ObjectId('6699475822a401fef562eb28'),
    username: 'jabs93',
    name: 'jabs',
    passwordHash
  })
  await user.save()

  // Log in to get a token
  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'jabs93',
      password: 'test1234'
    })

  token = loginResponse.body.token
  
    const newBlog = {
      title: 'Test New Blog Post',
      author: 'test by jabs',
      url: 'http://example.com',
      likes: 5,
      user: '6699475822a401fef562eb28'  // Ensure `new` keyword is used
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })
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