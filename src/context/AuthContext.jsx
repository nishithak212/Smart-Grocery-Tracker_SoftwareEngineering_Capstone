import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext ();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(() => {
        return localStorage.getItem("user") || null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", user);
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    //Logout function
    const logout = () => {
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{user, setUser, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;