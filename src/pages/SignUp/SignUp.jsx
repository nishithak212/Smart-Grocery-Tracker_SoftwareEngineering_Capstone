import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config.js";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

//const API_URL ="http://localhost:8080/api/users/register"; 

const SignUp = () =>{

    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name:"",
        last_name:"",
        username:"",
        password:""
    });

    //Check if user is already logged in
    useEffect(()=>{
        if (user) {
            navigate("/grocery-items"); //redirect logged-in user
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            await axios.post(`${API_URL}/users/register`, formData);
            navigate("/login");
        } catch(error) {
            console.error("Signup error", error.response.data.error);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required />
                <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required />
                <input type="text" name="username" placeholder="Userame" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;