import React, { useState, useEffect, createContext, useContext } from 'react';

// Create the AuthContext internally
const AuthContext = createContext();

// The AuthProvider component wraps your app and provides authentication data
export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    const storedAuth = sessionStorage.getItem('auth');
    if (storedAuth) {
      setAuthData(JSON.parse(storedAuth));
    }
  }, []);

  const setAuth = (data) => {
    sessionStorage.setItem('auth', JSON.stringify(data));
    setAuthData(data);
  };

  const logout = () => {
    sessionStorage.removeItem('auth');
    setAuthData(null);
  };

  return (
    <AuthContext.Provider value={{ authData, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access authentication data
export const useAuth = () => useContext(AuthContext);
