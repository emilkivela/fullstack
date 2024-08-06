const { test, after, beforeEach, describe} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const { before } = require('lodash')
const { request } = require('node:http')
const { Console } = require('node:console')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are six blogs', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blogs have id not _id', async () => {
  const response = await api.get('/api/blogs')
  assert.notEqual(response.body[0].id, undefined)
})

describe('with logged in user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User ({ username: 'root', passwordHash })

    await user.save()

    testToken = (await api.post('/api/login').send({username: 'root', password: 'sekret'})).body.token
  })

  test.only('a valid blog can be added with valid token', async () => {
    const newBlog = {
      title: 'How to test with Node',
      author: 'Matti Luukkainen',
      url: 'https://fäsätesti.fi',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${testToken}` })
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const titles = response.body.map(t => t.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length+1)
    assert(titles.includes('How to test with Node'))
  })

  test.only('a valid blog can not be added without token', async () => {
    const newBlog = {
      title: 'How to test with Node',
      author: 'Matti Luukkainen',
      url: 'https://fäsätesti.fi',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
  
})

test('blog without likes defaults them to zero', async () => {
  const noLikesBlog = {
    title: 'Likes in social media - an otiose effort?',
    author: 'John Doe',
    url: 'https://saynotolikes.com'
  }

  await api
    .post('/api/blogs')
    .send(noLikesBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body[response.body.length-1].likes, 0)
  
})

test('blog without title or url returns 400', async () => {
  const noTitleBlog = {
    author: 'Matti Meikäläine',
    url: 'www.notitles.fi',
    likes: 3
  }

  const noUrlBlog = {
    title: 'Blogs should only be written in newspapers',
    author: 'Theodore K',
    likes: 2
  }

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)

  await api
    .post('/api/blogs')
    .send(noTitleBlog)
    .expect(400)
  
  await api
    .post('/api/blogs')
    .send(noUrlBlog)
    .expect(400)
})

test('deleting a blog with valid id works', async () => {
  await api
    .delete('/api/blogs/5a422bc61b54a676234d17fc')
    .expect(204)
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length-1)
})

test('changing a blog works', async() => {
  const changedBlog = {
    title: "React patterns IS CHANGED",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  }

  await api
    .put('/api/blogs/5a422a851b54a676234d17f7')
    .send(changedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body[0].title, changedBlog.title)

})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User ({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with fresh username', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'sale48',
      name: 'Sauli Niinistö',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, userAtStart.length+1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
  
  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await api.get('/api/users')
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.body.length, usersAtStart.length)
  })

})
after(async () => {
  await mongoose.connection.close()
})
