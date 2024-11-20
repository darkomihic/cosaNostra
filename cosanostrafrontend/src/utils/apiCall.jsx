import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

const apiCall = async (url, options = {}, auth, setAuth) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${auth?.token}`,
      },
      credentials: 'include', // Ensure cookies are sent with the request
    });

    if (response.status === 401) {
      // Handle token expiration: refresh the token
      const refreshResponse = await fetch(`${process.env.REACT_APP_API}/refresh`, {
        method: 'POST',
        credentials: 'include', // Send cookies for refresh token
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setAuth((prevAuth) => ({ ...prevAuth, token: data.accessToken }));

        // Retry the original request with the new access token
        return apiCall(url, options, { ...auth, token: data.accessToken }, setAuth);
      } else {
        throw new Error('Refresh token expired or invalid');
      }
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};


export default apiCall;
