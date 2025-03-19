import {useState, useContext} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
    const [credentials, setCredentials] = useState({usernmae: "" , password: ""});
    const {setUser} = useContext(AuthContext);
    const navigate = useNavigate();
    
}