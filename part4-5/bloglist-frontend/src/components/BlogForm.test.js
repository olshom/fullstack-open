import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> create a new blog', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)
  const inputTitle = screen.getByPlaceholderText('write here a title')
  const inputAuthor = screen.getByPlaceholderText('write here an author')
  const inputUrl = screen.getByPlaceholderText('write here an url')
  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'title')
  await user.type(inputAuthor, 'author')
  await user.type(inputUrl, 'www.url.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  console.log(createBlog.mock.calls)
  expect(createBlog.mock.calls[0][0].title).toBe('title')
  expect(createBlog.mock.calls[0][0].author).toBe('author')
  expect(createBlog.mock.calls[0][0].url).toBe('www.url.com')
})
