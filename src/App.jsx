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
import { useEffect, useState } from "react";

const App = () => {
  //const { user } = useContext(AuthContext);
  const [user, setUser] = useState(sessionStorage.getItem("user_id"));

  useEffect(()=>{
    const handleStorageChange = () => {
      setUser(sessionStorage.getItem("user_id"));
    };

    window.addEventListener("storage", handleStorageChange);

    return() => {
      window.removeEventListener("storage",handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Navbar />
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
        <Route element={<ProtectedRoutes />}>
          <Route path="/grocery-items" element={<GroceryItemsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
