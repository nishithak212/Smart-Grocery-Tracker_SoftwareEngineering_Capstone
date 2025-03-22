import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";
// import { useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  // const {user, logout} = useContext(AuthContext);
  const navigate = useNavigate();

  const user = sessionStorage.getItem("user_id");

  const handleLogout = () => {
    sessionStorage.removeItem("user_id"); //to clear session storage
    //logout();
    navigate("/login"); //redirects to login page after logout
  };

  return (
    <nav className="navbar">
      {user ? (
        <ul className="navbar__list">
          <li>
            <Link to="/grocery-items">Grocery Items</Link>
          </li>
          <li>
            <Link to="/shopping-list">Shopping List</Link>
          </li>
          <li>
            <Link to="/notifications">Notifications</Link>
          </li>
          <li>
            <button onClick={handleLogout}> Sign Out</button>
          </li>
        </ul>
      ) : (
        ""
      )}
    </nav>
  );
};
export default Navbar;
