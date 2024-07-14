const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  // Find Blogs by ID using MongoDB
  const id = request.params.id;

  // Check if the ID is a valid MongoDB ObjectId
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return response.status(400).json({ error: 'Invalid ID format' });
  // }

  const blogFindById = await Blog.findById(id)

  if (blogFindById) {
    return response.json(blogFindById)
  } else {
    return response.status(404).end
  }

  // Find Blogs by ID using MongoDB
  // Blog.findById(id)
  //   .then(Blog => {
  //     if (Blog) {
  //       response.json(Blog);
  //     } else {
  //       response.status(404).end()
  //     }
  //   })
  //   .catch(error => next(error));
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body;
  console.log("bodyyyy", body);

  const user = await User.findById(body.user)
  console.log("userrr", user)

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
 
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {

  const blog = await Blog.findByIdAndDelete(request.params.id)

  if (!blog) {
    return response.status(404).json({
      error: 'ID does not exist!'
    });
  }
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }
  
    const findBlogById = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })

    if (!findBlogById) {
      return response.status(404).json({
        error: 'Blog post does not exist!!'
      });
    }

    response.json(findBlogById)
})

module.exports = blogsRouter