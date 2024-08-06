const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  const initialValue = {likes: 0}
  const reducer = (previous, blog) => {
    return blog.likes > previous.likes
    ? {
        title: blog.title,
        author: blog.author,
        likes: blog.likes
      }
    : {
      title: previous.title,
      author: previous.author,
      likes: previous.likes
    }
  }
  
  return blogs.reduce(reducer, initialValue)
}

const mostBlogs = (blogs) => {
  const author_most = _.head(_(blogs)
    .countBy('author')
    .entries()
    .maxBy(_.last))
  const authors_list = _.countBy(blogs, 'author')
  return {author: author_most, blogs: authors_list[author_most]}
}

const mostLikes = (blogs) => {
  const result = _(blogs)
                  .groupBy('author')
                  .mapValues(arr => _.sumBy(arr, 'likes'))
                  .entries()
                  .map(values => 
                    _.zipObject(['author', 'likes'], values)
                  )
                  .maxBy('likes')
  return result


}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}


