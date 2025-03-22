import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../../config.js";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import "./SignUpPage.scss";

const SignUp = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    if (user && window.location.pathname !== "/signup") {
      navigate("/grocery-items"); //redirect logged-in user
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/users/register`, formData);
      navigate("/login");
    } catch (error) {
      console.error("Signup error", error.response.data.error);
    }
  };

  return (
    <div className="signup">
      <h2 className="signup__header">Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup__form">
      <div className="signup__form-group">
        {/* <label htmlFor="first_name" className="signup__form--label">
            First Name:
            </label> */}
        <input
        className="signup__form--input"
          label="FirstName:"
          type="text"
          name="first_name"
          placeholder="First Name"
          onChange={handleChange}
          required
        />
        
        </div>
        <div className="signup__form-group">
        {/* <label htmlFor="last_name" className="signup__form--label">
            Last Name:
            </label> */}
        <input
        className="signup__form--input"
          type="text"
          name="last_name"
          placeholder="Last Name"
          onChange={handleChange}
          required
        />
       
         </div>
         <div className="signup__form-group">
        {/* <label htmlFor="username" className="signup__form--label">
            Username:
            </label> */}
        <input
        className="signup__form--input"
          type="text"
          name="username"
          placeholder="Userame"
          onChange={handleChange}
          required
        />
      
        </div>
        <div className="signup__form-group">
        {/* <label htmlFor="password" className="signup__form--label">
            Password:
            </label> */}
        <input
        className="signup__form--input"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
         </div>
        <button type="submit" className="signup__form--submit">Sign Up</button>
        <p className="login__text">Have an account? Please <Link to="/login" className="login-link">Login</Link></p>
      </form>
    </div>
  );
};

export default SignUp;
