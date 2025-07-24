import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [employer, setEmployer] = useState(null);

  const [userInfo, setUserInfo] = useState(null); // chứa decoded token

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo({
          username: decoded.name,
          role: decoded.role,
        });
      } catch (error) {
        console.error("Invalid token", error);
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
  }, [token]);

  const isLogin = token !== null;

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setEmployer(null);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        token,
        employer,
        userInfo,        // thêm info từ token
        setToken,
        setEmployer,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
