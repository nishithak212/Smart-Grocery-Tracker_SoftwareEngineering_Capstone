import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
//import { useContext } from "react";
import Navbar from "./components/Navbar/Navbar";
//import { AuthContext } from "./context/AuthContext";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import GroceryItemsPage from "./pages/GroceryItemsPage/GroceryItemsPage";
import ShoppingListPage from "./pages/ShoppingListPage/ShoppingListPage";
import NotificationsPage from "./pages/NotificationsPage/NotificationsPage";
import { useEffect, useState } from "react";
import "./App.scss";

const App = () => {
  //const { user } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  //Sync session storage with state
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user_id");
    setUser(storedUser);

    const handleStorageChange = () => {
      setUser(sessionStorage.getItem("user_id"));
    };

    // useEffect(()=>{
    //   const handleStorageChange = () => {
    //     setUser(sessionStorage.getItem("user_id"));
    //   };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/grocery-items" /> : <Navigate to="/login" />
          }
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes - Require Authentication */}
        <Route element={<ProtectedRoutes user={user} />} />
        <Route path="/grocery-items" element={<GroceryItemsPage />} />
        <Route path="/shopping-list" element={<ShoppingListPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
