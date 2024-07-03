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
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const blogsInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

module.exports = {
  initialBlogs, onlyOneBlog, emptyList, nonExistingId, blogsInDb
}