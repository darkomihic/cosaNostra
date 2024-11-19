<<<<<<< HEAD
import React, { useState, useEffect, createContext, useContext } from 'react';

// Create the AuthContext internally
const AuthContext = createContext();
=======
import { createContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext({});
>>>>>>> parent of ec66713 (asdasd)

// The AuthProvider component wraps your app and provides authentication data
export const AuthProvider = ({ children }) => {
<<<<<<< HEAD
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
=======
    const [auth, setAuth] = useState({});

    // Function to refresh the access token using the refresh token
    const refreshToken = useCallback(async () => {
        try {
            const response = await fetch('/refresh', {
                method: 'POST',
                credentials: 'include', // Ensure cookies are sent with the request
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }

            const data = await response.json();
            setAuth((prevAuth) => ({
                ...prevAuth,
                accessToken: data.accessToken, // Update accessToken in state
            }));

            return data.accessToken; // Return the new access token
        } catch (error) {
            console.error("Failed to refresh token:", error);
            setAuth({}); // Clear auth state on failure
            return null;
        }
    }, []);

    // Automatically refresh tokens before they expire
    useEffect(() => {
        const scheduleRefresh = () => {
            if (!auth.accessToken) return;

            const tokenExpiry = JSON.parse(atob(auth.accessToken.split(".")[1])).exp * 1000; // Decode token expiry
            const refreshTime = tokenExpiry - Date.now() - 5000; // Refresh 5 seconds before expiry

            if (refreshTime > 0) {
                const timer = setTimeout(refreshToken, refreshTime);
                return () => clearTimeout(timer);
            }
        };

        const timerCleanup = scheduleRefresh();
        return timerCleanup;
    }, [auth.accessToken, refreshToken]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
>>>>>>> parent of ec66713 (asdasd)
