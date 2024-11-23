import { useEffect } from "react";
import axiosPrivate from "../api/axiosInstance";  // Your axios instance
import useRefreshToken from "./useRefreshToken";  // Custom hook for refreshing token
import useAuth from "./useAuth";  // Custom hook for auth

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

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

};

export default useAxiosPrivate;
