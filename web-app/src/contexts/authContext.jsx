import { createContext, useContext, useState } from "react";
import axiosClient from '../utils/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    const storedToken = sessionStorage.getItem("authToken");
    return storedToken ? storedToken : null;
  });

  const login = (userData, token) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));

    setToken(token);
    sessionStorage.setItem('authToken', token);
  };

  const logout = async (all = false) => {
    endpoint = ENDPOINTS.LOGOUT;
    if (all === true) {
      endpoint = ENDPOINTS.LOGOUT_ALL;
    }
    const response = await axiosClient.post(endpoint);

    if (response.status === 200) {
      setUser(null);
      sessionStorage.removeItem("user");
  
      setToken(null);
      sessionStorage.removeItem("authToken");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
