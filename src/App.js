import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import New from './components/New'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
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
      const user = await loginService.login({
        username, password
      })

      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage('logged in succesfully')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogappUser')
    setMessage('logged out succesfully')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleCreation = async (event) => {
    event.preventDefault()

    try {
      const newBlog = {
        title,
        author,
        url,
      }

      await blogService.createBlog(newBlog)
      newBlog.id = newBlog.title
      setBlogs(blogs.concat(newBlog))
      setMessage('a new blog created succesfully')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage('blog creation failed')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={message}/>
        <Login handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>
      </div>
    )
  } 

  return (
    <div>
        <h2>blogs</h2>
        <Notification message={message}/>
        <div>{user.name} logged in</div>
        <form onSubmit={handleLogout}>
          <button type="submit">logout</button>
        </form> <br/>
        <New title={title} author={author} url={url} setTitle={setTitle} setAuthor={setAuthor} setUrl={setUrl} handleCreation={handleCreation}/> <br/>
        {blogs.map(blog => 
          <Blog key={blog.id} blog={blog} />
        )}
    </div>
  )
}

export default App