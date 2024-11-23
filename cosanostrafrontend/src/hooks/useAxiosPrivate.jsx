import { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axiosInstance";  // Your axios instance
import useRefreshToken from "./useRefreshToken";  // Custom hook for refreshing token
import useAuth from '../hooks/useAuth';  // Import the custom hook
import axios from "axios";
import { useNavigate } from "react-router-dom";



const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const apiUrl = process.env.REACT_APP_API;
  const [isLoading, setIsLoading] = useState(true); // To manage loading state
  const navigate = useNavigate();
  const { setAuth } = useAuth();


  useEffect(() => {
  
    if (auth?.token == null) {
      console.log("Token is null, attempting to refresh...");
  
      const refreshToken = async () => {
        try {
          const newAccessToken = await refresh();
          if (newAccessToken) {
            setAuth((prev) => ({
              ...prev,
              token: newAccessToken,
            }));
          } else {
            console.warn("No Access Token returned. Redirecting to login...");
            navigate("/login", { replace: true });
          }
        } catch (error) {
          console.error("Error refreshing token:", error.message);
          navigate("/login", { replace: true });
        }
      };
      
  
      refreshToken();
    }
  
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => {
        console.log("Response Interceptor: Response Data", response.data);
        return response;
      },
      async (error) => {
        console.error("Response Interceptor Error:", error);
        const prevRequest = error?.config;
  
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          console.log("Token expired, attempting to refresh...");
          prevRequest.sent = true;
  
          try {
            const newAccessToken = await refresh();
            if (newAccessToken) {
              console.log("New Access Token from Refresh:", newAccessToken);
              setAuth((prev) => ({
                ...prev,
                token: newAccessToken,
              }));
  
              prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return axiosPrivate(prevRequest);
            }
          } catch (refreshError) {
            console.error("Token refresh failed during interceptor:", refreshError);
            navigate("/login", { replace: true }); // Redirect on refresh failure
          }
        }
  
        return Promise.reject(error);
      }
    );
  
    // Cleanup the interceptor on unmount
    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth?.token, setAuth, axiosPrivate, refresh, navigate]);
  
  useEffect(() => {
    if (auth?.token) {
      const axiosInstance = axios.create({
        baseURL: apiUrl, // Set your API base URL
        headers: {
          Authorization: `Bearer ${auth.token}`, // Add the token to headers
        },
      });

      axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            console.log("Unauthorized, refresh token...");
            // Refresh token logic can be implemented here
          }
          return Promise.reject(error);
        }
      );

      setIsLoading(false);
    }
  }, [auth?.token]); // Re-run the effect whenever auth.token changes

  useEffect(() => {
    console.log("Auth state in useAxiosPrivate:", auth);  // Debugging auth state

    

    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        console.log('Request Interceptor: Auth state:', auth); // Log the auth state
        if (auth?.token && !config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth.token}`;
          console.log("Request Headers after Authorization:", config.headers);  // Log the updated headers
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => {
        console.log("Response Interceptor: Response Data", response.data);
        return response;
      },
      async (error) => {
        console.error("Response Interceptor Error:", error);
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          console.log("Token expired, attempting to refresh...");
          prevRequest.sent = true;

          const newAccessToken = await refresh();
          console.log("New Access Token from Refresh:", newAccessToken);

          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]); // Run whenever auth or refresh changes

  return axiosPrivate;

};

export default useAxiosPrivate;
