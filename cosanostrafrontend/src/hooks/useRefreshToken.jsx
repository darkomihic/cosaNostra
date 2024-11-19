import { useState, useEffect } from 'react';
import useAuth from './useAuth'; // Assuming this hook provides access to auth tokens
import jwtDecode from 'jwt-decode'; // Don't forget to install and import jwt-decode

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  // Function to refresh the token using the refresh token (if needed)
  const refreshToken = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/refresh`, {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent with the request
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to refresh token');

      const data = await response.json();
      setAuth((prevAuth) => {
        const updatedAuth = { ...prevAuth, accessToken: data.accessToken };
        sessionStorage.setItem("auth", JSON.stringify(updatedAuth)); // Save updated auth to sessionStorage
        return updatedAuth;
      });
    } catch (error) {
      console.error('Failed to refresh token:', error);
    } finally {
      setLoading(false);
    }
  };

  // Optional: Refresh token if it's about to expire
  useEffect(() => {
    if (auth?.accessToken) {
      const tokenExpiration = jwtDecode(auth.accessToken).exp * 1000; // Decode token to get the expiration time
      const now = Date.now();

      // Refresh the token if it's about to expire in the next 5 minutes
      if (tokenExpiration - now < 300000 && !loading) {
        refreshToken();
      }
    }
  }, [auth, loading]);

  return { loading, refreshToken };
};

export default useRefreshToken;
