const Blog = require('../models/blog')

const emptyList = [];

const initialBlogs = [
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
      "title": "testdulu",
      "author": "TESTESTSEES",
      "url": "www.test12312.com",
      "likes": 10,
      "id": "6672fcaecc5aae16ed38a085"
  }
]

const onlyOneBlog = [
    {
        "author": "JABSS",
        "url": "www.testuploadbloggg.com",
        "likes": 3,
        "title": "test lagi 3231321321",
        "id": "6671b7adf198a684059c9f07"
    }
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willthissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blog = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, onlyOneBlog, emptyList, nonExistingId, blogsInDb
}