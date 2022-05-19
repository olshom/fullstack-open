const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');
const jwt = require('jsonwebtoken');

let token;

beforeEach(async () => {
  await Blog.deleteMany({});
  const UserObject = new User({
    ...helper.initialUser,
    passwordHash: await helper.generateHash(),
  });
  await UserObject.save();
  const BlogObjects = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: UserObject })
  );
  const promisesArray = BlogObjects.map((blog) => blog.save());
  await Promise.all(promisesArray);
  token = jwt.sign(
    { username: UserObject.username, id: UserObject._id },
    process.env.SECRET
  );
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('the correct amount of blog posts', async () => {
  const blogs = await helper.blogsInDB();
  expect(blogs).toHaveLength(helper.initialBlogs.length);
});

test('the unique identifier is named id', async () => {
  const blogs = await helper.blogsInDB();
  expect(blogs[0].id).toBeDefined();
});

test('blog post can be added', async () => {
  const newBlog = {
    title: 'to add a new blog',
    author: 'Jussi Hokkonen',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDB();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const contents = blogsAtEnd.map((blog) => blog.title);
  expect(contents).toContain('to add a new blog');
});

test('likes property has default value', async () => {
  const newBlog = {
    title: 'to add a new blog without property likes',
    author: 'Antti Hokkonen',
    url: 'http://www.cs.utexas.edu/~EWD/',
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDB();
  const indexAddedBlog = blogsAtEnd.length - 1;
  expect(blogsAtEnd[indexAddedBlog].likes).toBe(0);
  expect(blogsAtEnd[indexAddedBlog].title).toBe(
    'to add a new blog without property likes'
  );
});

test('title property is required', async () => {
  const newBlog = {
    author: 'Riita Hokkonen',
    url: 'https://www.riita.com',
    likes: 2,
  };
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDB();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test('url property is required', async () => {
  const newBlog = {
    title: 'to test url property',
    author: 'Leonora Hokkonen',
    likes: 2,
  };
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDB();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test('blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDB();
  const blogToDelete = blogsAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `bearer ${token}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDB();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
  const contents = blogsAtEnd.map((n) => n.title);
  expect(contents).not.toContain(blogToDelete.title);
});

test('blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDB();
  const blogToUpdate = blogsAtStart[0];

  const toUpdate = {
    title: blogToUpdate.title + 'update',
    likes: blogToUpdate.likes + 1,
  };
  await api.put(`/api/blogs/${blogToUpdate.id}`).send(toUpdate).expect(200);

  const blogsAtEnd = await helper.blogsInDB();
  expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes + 1);
});
afterAll(() => {
  mongoose.connection.close();
});
