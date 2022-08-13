import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [className, setClassName] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exeptions) {
      setMessage('wrong username or password')
      setClassName('error')
      setTimeout(() => {
        setMessage(null)
        setClassName('')
      }, 5000)
    }
  }
  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setClassName('notification')
      setTimeout(() => {
        setMessage(null)
        setClassName('')
      }, 5000)

      blogFormRef.current.toggleVisibility()

      setBlogs(blogs.concat(returnedBlog))
    } catch (e) {
      console.log(e)
      setClassName('error')
      setMessage(e.response.data.error)
      setTimeout(() => {
        setMessage(null)
        setClassName('')
      }, 5000)
    }
  }

  const raiseLikeOf = (id) => {
    const blog = blogs.find((blog) => blog.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }
    blogService
      .update(id, changedBlog)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
      })
      .catch(() => {
        setMessage(`Blog '${blog.title}' was already removed from server`)
        setClassName('error')
        setTimeout(() => {
          setMessage(null)
          setClassName('')
        }, 5000)
        setBlogs(blogs.filter((n) => n.id !== id))
      })
  }

  const removeBlog = async (id, title, author) => {
    if (window.confirm(`Remove blog ${title} by ${author}`)) {
      await blogService.remove(id)
      setBlogs(blogs.filter((n) => n.id !== id))
    }
  }
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} className={className} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id="password"
              type="text"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">
            login
          </button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} className={className} />
      <p>
        {user.name} logged in <button onClick={handleLogOut}>log out</button>
      </p>
      <Togglable buttonLabel="create new" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      {sortedBlogs.map((blog) => {
        return (
          <Blog
            key={blog.id}
            blog={blog}
            raiseLike={() => raiseLikeOf(blog.id)}
            removeBlog={() => removeBlog(blog.id, blog.title, blog.author)}
            user={user}
          />
        )
      })}
    </div>
  )
}

export default App
