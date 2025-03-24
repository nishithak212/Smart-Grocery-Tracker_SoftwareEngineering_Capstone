import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import GroceryItemsPage from "./pages/GroceryItemsPage/GroceryItemsPage";
import ShoppingListPage from "./pages/ShoppingListPage/ShoppingListPage";
import NotificationsPage from "./pages/NotificationsPage/NotificationsPage";
import { useContext } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "./App.scss";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="app">
        <Header />
        <Navbar user={user} />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to="/grocery-items" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/grocery-items" element={<GroceryItemsPage />} />
              <Route path="/shopping-list" element={<ShoppingListPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
