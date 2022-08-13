const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')

describe('create a new user with valid properties', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'root', passwordHash, name: 'My Name' })

    await user.save()
  })
  test('to add a new user', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'olshom',
      password: 'myPassword',
      name: 'Olga Shomarova',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await helper.usersInDb()
    expect(userAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = userAtEnd.map((user) => user.username)
    expect(usernames).toContain(newUser.username)
  })
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'root',
      password: 'myPassword',
      name: 'Olga Shomarova',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('username must be unique')
  })
  test('cant create user with username 2 characters length', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ol',
      password: 'myPassword',
      name: 'Olga Shomarova',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await helper.usersInDb()
    expect(userAtEnd).toHaveLength(usersAtStart.length)
  })
  test('cant create user with password 2 characters length', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'olshom',
      password: 'pa',
      name: 'Olga Shomarova',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain(
      'password must be at least 3 characters long'
    )
    const userAtEnd = await helper.usersInDb()
    expect(userAtEnd).toHaveLength(usersAtStart.length)
  })
})
