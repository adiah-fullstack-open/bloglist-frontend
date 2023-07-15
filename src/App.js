import { useEffect, useState } from "react";
import Blog from "./components/Blog";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [errorMessage, setErrorMessage] = useState(null);

  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();

    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
  };

  const handleBlogChange = (event) => {
    setNewBlog({ ...newBlog, [event.target.name]: event.target.value });
  };

  const addBlog = (event) => {
    event.preventDefault();

    blogService.create(newBlog).then((returnedNote) => {
      setBlogs(blogs.concat(returnedNote));
      setNewBlog({
        title: "",
        author: "",
        url: "",
      });
    });
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <div>
        username
        <input
          type="text"
          name="Username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const newBlogForm = () => (
    <form onSubmit={addBlog}>
      <h3>Create New</h3>

      <div>
        title
        <input
          type="text"
          name="title"
          value={newBlog.title}
          onChange={handleBlogChange}
        />
      </div>
      <div>
        author
        <input
          type="text"
          name="author"
          value={newBlog.author}
          onChange={handleBlogChange}
        />
      </div>
      <div>
        url
        <input
          type="url"
          name="url"
          value={newBlog.url}
          onChange={handleBlogChange}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );

  const logoutButton = () => (
    <button type="button" onClick={handleLogout}>
      Logout
    </button>
  );

  const blogsList = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      {logoutButton()}
      {newBlogForm()}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );

  return <div>{user === null ? loginForm() : blogsList()}</div>;
};

export default App;
