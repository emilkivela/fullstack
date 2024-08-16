import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title', () => {
  const blog = {
    title: 'React testing',
    author: 'Matti Luukkainen',
    url: 'www.fsfronttest.com',
    likes: 0
  }

  const { container } = render(<Blog blog={blog}/>)

  expect(container).toHaveTextContent('React testing')
})

test('clicking the button shows all info', async () => {
  const blog = {
    title: 'React button press testing',
    author: 'Matti Luukkainen',
    url: 'www.fsfronttest.com',
    likes: 0,
    user: {
      username: 'mluukkai'
    }
  }
  const username = {
    username: 'mluukkai'
  }

  const { container } = render(<Blog blog={blog} user={username}/>)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  expect(container).toHaveTextContent('www.fsfronttest.com')
  expect(container).toHaveTextContent('0')
  expect(container).toHaveTextContent('Matti Luukkainen')
})

test('clicking like button calls mock handler', async () => {
  const blog = {
    title: 'React button press testing',
    author: 'Matti Luukkainen',
    url: 'www.fsfronttest.com',
    likes: 0,
    user: {
      username: 'mluukkai'
    }
  }
  const username = {
    username: 'mluukkai'
  }
  const mockHandler = vi.fn()
  render(<Blog blog={blog} user={username} likeBlog={mockHandler}/>)
  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(1)
  await user.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(2)


})
