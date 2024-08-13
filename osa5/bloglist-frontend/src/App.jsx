import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  if (message.includes('by')) {
    return (
      <div className='blog'>
        {message}
      </div>
    )
  }
  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a,b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggerUserJSON = window.localStorage.getItem('loggedUser')
    if (loggerUserJSON) {
      const user = JSON.parse(loggerUserJSON)
      setUser(user)
      console.log(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exeption) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const createBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setErrorMessage(
          `a new blog ${returnedBlog.title} by ${returnedBlog.author}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      })
  }

  const likeBlog = (id, blogObject) => {
    const likedBlog = { ...blogObject, likes: blogObject.likes+1 }
    blogService
      .update(id, likedBlog)
      .then(response => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : response).sort((a,b) => b.likes - a.likes))
      })
  }

  const removeBlog = (id, blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}?`)) {
      blogService
        .remove(id)
        .then(response => {
          setBlogs(blogs.filter(blog => blog.id !== id))
        })
    }
  }

  const blogFormRef = useRef()


  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
  }

  if (user === null) {
    return (
      <div>
        <h2>login</h2>
        <Notification message={errorMessage}/>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage}/>
      {user.name} logged in
      <button onClick={handleLogout}>logout</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={() => likeBlog(blog.id, blog)} removeBlog={() => removeBlog(blog.id, blog)} user={user}/>
      )}
      <h2>create new</h2>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={createBlog}/>
      </Togglable>
    </div>
  )
}

export default App