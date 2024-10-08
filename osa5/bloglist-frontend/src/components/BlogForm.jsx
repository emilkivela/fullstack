import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title
        <input
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
          id='title'/><br></br>
        author
        <input
          value={newAuthor}
          onChange={event => setNewAuthor(event.target.value)}
          id='author'/><br></br>
        url
        <input
          value={newUrl}
          onChange={event => setNewUrl(event.target.value)}
          id='url'/><br></br>
      </div>
      <div>
        <button id='submit-button' type='submit'>create</button>
      </div>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm