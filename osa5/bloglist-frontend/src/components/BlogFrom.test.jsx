import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const inputTitle = container.querySelector('#title')
  const inputAuthor = container.querySelector('#author')
  const inputUrl = container.querySelector('#url')

  const sendButton = screen.getByText('create')
  
  await user.type(inputTitle, 'Form sending test')
  await user.type(inputAuthor, 'Antti Laaksonen')
  await user.type(inputUrl, 'www.fäsä.fi')

  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0].title).toBe('Form sending test')


})