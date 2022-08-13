import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('a blog renders the blogs title and author', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Olga Shomarova',
    url: 'www.url.com',
    likes: 8,
  }

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
  expect(div).toHaveTextContent('Olga Shomarova')
  expect(div).not.toHaveTextContent('www.url.com')
  expect(div).not.toHaveTextContent('8')
})

test('the blogs url and number of likes are shown when the button has been clicked', async () => {
  const userr = {
    id: '123',
  }
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Olga Shomarova',
    url: 'www.url.com',
    likes: 8,
    user: {
      id: '123',
      name: 'user',
    },
  }

  const { container } = render(<Blog blog={blog} user={userr} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
  expect(div).toHaveTextContent('Olga Shomarova')
  expect(div).toHaveTextContent('www.url.com')
  expect(div).toHaveTextContent('8')
})

test('the like button is clicked twice', async () => {
  const userr = {
    id: '123',
  }
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Olga Shomarova',
    url: 'www.url.com',
    likes: 8,
    user: {
      id: '123',
      name: 'user',
    },
  }

  const mockHandler = jest.fn()
  render(<Blog blog={blog} user={userr} raiseLike={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const buttonLike = screen.getByText('like')
  await user.click(buttonLike)
  await user.click(buttonLike)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
