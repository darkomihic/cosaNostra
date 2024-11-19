import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useAuth } from '../context/AuthProvider'; // Assuming useAuth hook is in place
import jwtDecode from 'jwt-decode'; // Don't forget to install and import jwt-decode
=======
import useAuth from './useAuth'; // Assuming this hook provides access to auth tokens
>>>>>>> parent of ec66713 (asdasd)

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  // Function to refresh the token using the refresh token
  const refreshToken = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/refresh-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth?.refreshToken}`,
        },
      });
      const data = await response.json();
      if (data?.accessToken) {
        setAuth({ ...auth, token: data.accessToken });
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check token expiration and refresh on mount or when the token is near expiration
  useEffect(() => {
    if (auth?.token) {
      const tokenExpiration = jwtDecode(auth.token).exp * 1000; // Decode the token to get the expiration time
      const now = Date.now();

      // Refresh the token if it's about to expire in the next 5 minutes
      if (tokenExpiration - now < 300000 && !loading) {
        refreshToken();
      }
    }
  }, [auth, loading, setAuth]);

  return { loading, refreshToken };
};

export default useRefreshToken;
