const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware');
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
  console.log("BLOGS length", blogs.length)
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  // Find Blogs by ID using MongoDB
  const id = request.params.id;

  // Check if the ID is a valid MongoDB ObjectId
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return response.status(400).json({ error: 'Invalid ID format' });
  // }
  const blogFindById = await Blog.findById(id).populate('user', { username: 1, name: 1 });

  if (blogFindById) {
    return response.json(blogFindById)
  } else {
    return response.status(404).end
  }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user
  
  if (!user) {
    return response.status(401).json({
      error: 'token not provided'
    });
  }

  if (!body.title || !body.url) {
    return response.status(400).json({
      error: 'content missing'
    });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : Number(body.likes),
    user: user._id
  });

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
 
  // ✅ This populates the blog's `user` field with { id, username, name }
  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 });

  console.log('User creating the blog:', user);
  response.status(201).json(populatedBlog);
});

//
blogsRouter.get('/test', middleware.userExtractor, (request, response) => {

  response.json({ user: request.user });
});

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  console.log('User:', request.user); // Debug line

  const user = request.user

  // Check if the user is authenticated
  if (!user) {
    return response.status(401).json({ error: 'user not authenticated' });
  }

  try {
  const blog = await Blog.findById(request.params.id)

  if(user._id.toString() !== blog.user.toString()) {
    return response.status(403).json({ error: 'permission denied'})
  }

  if (!blog) {
    return response.status(404).json({
      error: 'ID/Blog not found!'
    });
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
  } catch (error) {
    console.error('Error handling delete request:', error); // Log error
    response.status(500).json({ error: 'something went wrong' });
  }
});

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }
  
    const findBlogById = await Blog.findByIdAndUpdate
                          (request.params.id, 
                            blog, 
                            { new: true, runValidators: true, context: 'query' }
                          )

    if (!findBlogById) {
      return response.status(404).json({
        error: 'Blog post does not exist!!'
      });
    }

    response.json(findBlogById)
})

module.exports = blogsRouter