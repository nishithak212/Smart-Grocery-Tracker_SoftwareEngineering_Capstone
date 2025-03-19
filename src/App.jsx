import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Navbar from "./components/Navbar/Navbar";
import { AuthContext } from "./context/AuthContext";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";

const App =()=> {
  const {user} = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/grocery-items" /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      </Router>
  )
}

export default App
