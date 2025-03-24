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
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);

      //store user_id in sessionStorage
      sessionStorage.setItem("user_id", response.data.user_id);
      sessionStorage.setItem("username", response.data.username);

      //update AuthContext
      setUser(response.data.user_id);

      navigate("/grocery-items");
    } catch (error) {
      const errMsg = error.response?.data?.error;

      if (errMsg?.includes("not registered")) {
        setErrorMessage("User is not registered.");
      } else if (errMsg?.includes("Credentials do not match")) {
        setErrorMessage("Incorrect username or password. Please try again.");
      } else {
        setErrorMessage("Internal Server Error. Please try after sometime.");
      }
      console.error("Login error:", error.response?.data?.error);
    }
  };

  return (
    <div className="login">
      {errorMessage && <div className="login__error">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="login__form">
        <div className="login__form-group">
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
        <p className="p1">
          Don't have an account?
          <Link to="/signup" className="signup-link">
            {" "}
            Sign Up!
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
