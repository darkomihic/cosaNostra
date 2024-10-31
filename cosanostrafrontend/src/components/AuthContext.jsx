import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');

  const login = (token) => {
    setToken(token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setToken('');
    setIsLoggedIn(false);
  };

  // Check if user is already logged in
  useEffect(() => {
    // Example: You could check for a stored token or some session state
    // Here you can use your own logic if needed
    const existingToken = token; // Replace with your token check logic
    if (existingToken) {
      setIsLoggedIn(true);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
