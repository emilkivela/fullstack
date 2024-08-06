const { test, describe } = require('node:test')
const helper = require('./test_helper')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const emptyList = []
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(helper.initialBlogs)
    assert.strictEqual(result, 36)
  })
})

describe('most liked blogger', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  

  test('of a list with a single blogger', () => {
    result = listHelper.favouriteBlog(listWithOneBlog)
    assert.deepEqual(result, {title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', likes: 5})
  })

  test('of a list with multiple blogs', () => {
    result = listHelper.favouriteBlog(helper.initialBlogs)
    assert.deepEqual(result, {title: helper.initialBlogs[2].title, author: helper.initialBlogs[2].author, likes:helper.initialBlogs[2].likes})
  })
})

describe('the author', () => {
  test('with most blogs', () =>{
    result = listHelper.mostBlogs(helper.initialBlogs)
    assert.deepEqual(result, { author: 'Robert C. Martin', blogs: 3 })
  })

  test('with most likes', () => {
    result = listHelper.mostLikes(helper.initialBlogs)
    assert.deepEqual(result,{ author: 'Edsger W. Dijkstra', likes: 17 })
  })
})
