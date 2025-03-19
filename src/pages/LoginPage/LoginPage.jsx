import {useState, useContext} from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config.js";

const Login = () => {
    const [credentials, setCredentials] = useState({username: "" , password: ""});
    const {setUser} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await axios.post(`${API_URL}/users/login`, credentials);
            setUser(credentials.username);
            navigate("/grocery-items");
        } catch (error) {
            console.error("Login error:", error.response?.data?.error || "Server not responding");
        }
    };

    return(
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Login</button>
                <p>Don't have an account? <Link to="/signup">Sign Up!</Link></p>
            </form>
        </div>
    );
};

export default Login;