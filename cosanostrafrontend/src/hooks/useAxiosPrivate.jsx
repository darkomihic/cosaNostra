import { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axiosInstance";  // Your axios instance
import useRefreshToken from "./useRefreshToken";  // Custom hook for refreshing token
import useAuth from '../hooks/useAuth';  // Import the custom hook
import { useNavigate, useLocation } from "react-router-dom";  // Import useNavigate and useLocation
import axios from "axios";

const useAxiosPrivate = () => {
  const { refresh } = useRefreshToken();
  const { auth } = useAuth();
  const apiUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_API_LOCAL // Use local API in development
    : process.env.REACT_APP_API;      // Use production API in production
  const [isLoading, setIsLoading] = useState(true); // To manage loading state
  const navigate = useNavigate();
  const location = useLocation();  // Get current location
  const { setAuth } = useAuth();

  useEffect(() => {
    if (auth?.token == null) {

      const refreshToken = async () => {
        try {
          const newAccessToken = await refresh();
          if (newAccessToken) {
            setAuth((prev) => ({
              ...prev,
              token: newAccessToken,
            }));
          } else {
            console.warn("No Access Token returned. Not redirecting from current page.");
            // Avoid redirecting to login if already on the login page
            if (location.pathname !== "/login" && location.pathname !=="/" && location.pathname !=="") {
              navigate("/login", { replace: true });
            }
          }
        } catch (error) {
          // Prevent redirection from certain pages like '/login'
          if (location.pathname !== "/login" && location.pathname !=="/" && location.pathname !=="") {
            navigate("/login", { replace: true });
          }
        }
      };

      refreshToken();
    }

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        console.error("Response Interceptor Error:", error);
        const prevRequest = error?.config;

        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;

          try {
            const newAccessToken = await refresh();
            if (newAccessToken) {
              setAuth((prev) => ({
                ...prev,
                token: newAccessToken,
              }));

              prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return axiosPrivate(prevRequest);
            }
          } catch (refreshError) {
            console.error("Token refresh failed during interceptor:", refreshError);
            // Prevent redirection from certain pages like '/login'
            if (location.pathname !== "/login" && location.pathname !=="/" && location.pathname !=="/") {
              navigate("/login", { replace: true });
            }
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup the interceptor on unmount
    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth?.token, setAuth, axiosPrivate, refresh, navigate, location.pathname]);

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
          }
          return Promise.reject(error);
        }
      );

      setIsLoading(false);
    }
  }, [auth?.token]); // Re-run the effect whenever auth.token changes

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (auth?.token && !config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  }, [auth]);

  return axiosPrivate;
};

export default useAxiosPrivate;
