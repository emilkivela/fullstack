import { useState } from 'react'

const Blog = (props) => {
  const [allInfoVisible, setAllInfoVisible] = useState(false)


  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  if (!allInfoVisible) {
    return (
      <div style={blogStyle}>
        {props.blog.title} {props.blog.author} <button onClick={() => setAllInfoVisible(true)}>view</button>
      </div>
    )
  }
  return (
    <div style={blogStyle}>
      {props.blog.title} <button onClick={() => setAllInfoVisible(false)}>hide</button><br></br>
      {props.blog.url}<br></br>
      {props.blog.likes} <button onClick={props.likeBlog}>like</button><br></br>
      {props.blog.author}<br></br>
      {(props.user.username === props.blog.user.username) && <button onClick={props.removeBlog}>remove</button>}
    </div>
  )
}

export default Blog