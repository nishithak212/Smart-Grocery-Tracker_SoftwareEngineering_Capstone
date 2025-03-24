import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => sessionStorage.getItem("user_id"));

  // Load user_id from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user_id");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const logout = () => {
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("username");
    setUser(null);
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
