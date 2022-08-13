const blog = require('../models/blog')
const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  maxLikes = Math.max(...blogs.map((blog) => blog.likes))
  const oneBlog = blogs.find((blog) => blog.likes === maxLikes)
  return { title: oneBlog.title, author: oneBlog.author, likes: oneBlog.likes }
}

const mostBlogs = (blogs) => {
  const authors = blogs.map((blog) => blog.author)
  const authorsBlogs = _.countBy(authors)
  const maxBlogs = Math.max(...Object.values(authorsBlogs))
  return Object.entries(authorsBlogs)
    .map(([key, value]) => ({
      author: key,
      blogs: value,
    }))
    .find((obj) => obj.blogs === maxBlogs)
}

const mostLikes = (blogs) => {
  const authors = blogs.reduce((blogger, object) => {
    if (!blogger[object.author]) {
      blogger[object.author] = object.likes
    } else {
      blogger[object.author] += object.likes
    }

    return blogger
  }, {})
  const maxLikes = Math.max(...Object.values(authors))
  return Object.entries(authors)
    .map(([key, value]) => ({
      author: key,
      likes: value,
    }))
    .find((obj) => obj.likes === maxLikes)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
