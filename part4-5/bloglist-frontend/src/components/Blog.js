import { useState } from 'react'

const Blog = ({ blog, raiseLike, removeBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const [hide, setHide] = useState(false)

  return (
    <div className="blog" id="blog" style={blogStyle}>
      {blog.title} {blog.author}
      {hide === true ? (
        <>
          <button onClick={() => setHide(!hide)}>hide</button>
          <div id="like">
            likes: {blog.likes}
            <button onClick={raiseLike}>like</button>
          </div>
          <div>{blog.url}</div>
          <div>{blog.user.name}</div>
          {blog.user && blog.user.id === user.id ? (
            <button onClick={removeBlog}>remove</button>
          ) : null}
        </>
      ) : (
        <>
          <button onClick={() => setHide(!hide)}>view</button> <br />
        </>
      )}
    </div>
  )
}

export default Blog
