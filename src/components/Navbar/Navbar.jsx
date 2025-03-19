import {Link, useNavigate} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {

    const {user, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () =>{
        logout();
        navigate("/login"); //redirects to login page after logout
    };

    return(
        <nav>
            <h2>🍇🍅🍞Grocery Genie 🧞</h2>
            {user ? (
                <ul>
                    <li><Link to="/grocery-items">Grocery Items</Link></li>
                    <li><Link to="/shopping-list">Shopping List</Link></li>
                    <li><Link to="/notifications">Notifications</Link></li>
                    <li><Link to="/user-preferences">User Preferences</Link></li>
                    <li><button onClick={handleLogout}> Sign Out</button></li>
                </ul>
            ) : (
                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Sign Up</Link></li>
                </ul>
            )}
        </nav>
    );
};
export default Navbar;