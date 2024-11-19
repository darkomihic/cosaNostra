import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    accessToken: null,
  });

  // Check if the token is available in cookies on load
  useEffect(() => {
    const refreshToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('refreshToken='))
      ?.split('=')[1];

    if (refreshToken) {
      // You can verify the refreshToken here by sending it to your API
      setAuth({ accessToken: 'dummyAccessToken' });  // Replace with logic to get a valid access token
    }
  }, []);

  // Function to log out
  const logout = () => {
    setAuth({ accessToken: null });
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC'; // Clear refresh token
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
