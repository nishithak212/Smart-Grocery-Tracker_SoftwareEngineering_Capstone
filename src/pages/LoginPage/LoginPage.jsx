import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config.js";
import "./LoginPage.scss";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);

      //store user_id in sessionStorage
      sessionStorage.setItem("user_id", response.data.user_id);

      //update AuthContext
      setUser(response.data.user_id);

      navigate("/grocery-items");
    } catch (error) {
      console.error("Login error:", error.response?.data?.error);
    }
  };

  return (
    <div className="login">
      <h2 className="login__header">Login</h2>
      <form onSubmit={handleSubmit} className="login__form">
        <div className="login__form-group">
          {/* <label htmlFor="username" className="login__form--label">
            Username:
          </label> */}
          <input
            className="login__form--input"
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
        </div>
        <div className="login__form-group">
          {/* <label htmlFor="password" className="login__form--label">
            Password:
          </label> */}
          <input
            className="login__form--input"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login__form--submit">
          Login
        </button>
        <p>
          Don't have an account?
          <Link to="/signup" className="signup-link">
            {" "}Sign Up!
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
