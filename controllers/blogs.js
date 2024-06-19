const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog.find({}).then(blogs => {
        response.json(blogs);
      }).catch(error => {
        logger.error('Error fetching Blogs:', error.message);
        console.error('Error fetching Blogs:', error.message);
        response.status(500).json({ error: 'Failed to fetch Blogs' });
      });
})

blogsRouter.get('/:id', (request, response, next) => {
  // Find Blogs by ID using MongoDB
  const id = request.params.id;

  // Check if the ID is a valid MongoDB ObjectId
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return response.status(400).json({ error: 'Invalid ID format' });
  // }

  // Find Blogs by ID using MongoDB
  Blog.findById(id)
    .then(Blog => {
      if (Blog) {
        response.json(Blog);
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error));
})

blogsRouter.post('/', (request, response, next) => {
  // Add new Blog using MongoDB 
  const body = request.body
  
  if (!body.title) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // Add new Blog when using MongoDB 
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: Number(body.likes)
  })

  blog.save().then(savedBlog=> {
    response.json(savedBlog)
  }).catch(error =>next(error))
})

blogsRouter.delete('/:id', (request, response, next) => {
  // Delete person using MONGO DB
  Blog.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }
  
    Blog.findByIdAndUpdate(
      request.params.id, 
      blog,
      { new: true, runValidators: true, context: 'query' }
    )
      .then(updatedBlog => {
        response.json(updatedBlog)
      })
      .catch(error => next(error))
})

module.exports = blogsRouter