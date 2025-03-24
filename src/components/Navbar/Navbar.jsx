import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = sessionStorage.getItem("user_id");
  const username = sessionStorage.getItem("username");

  const handleLogout = () => {
    sessionStorage.removeItem("user_id"); //to clear session storage
    navigate("/login"); //redirect to login page after logout
  };

  return (
    <nav className="navbar">
      {user ? (
        <ul className="navbar__list">
          <li>
            <Link
              to="/grocery-items"
              className={location.pathname === "/grocery-items" ? "active" : ""}
            >
              Grocery Items
            </Link>
          </li>
          <li>
            <Link
              to="/shopping-list"
              className={location.pathname === "/shopping-list" ? "active" : ""}
            >
              Shopping List
            </Link>
          </li>
          <li>
            <Link
              to="/notifications"
              className={location.pathname === "/notifications" ? "active" : ""}
            >
              Notifications
            </Link>
          </li>
          <li>
            <span className="navbar__username">Hello {username} !</span>
          </li>
          <li>
            <button className="navbar__signout" onClick={handleLogout}>
              {" "}
              Log Out
            </button>
          </li>
        </ul>
      ) : (
        ""
      )}
    </nav>
  );
};
export default Navbar;
