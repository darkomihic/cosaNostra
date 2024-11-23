import axios from "../api/axiosInstance";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      console.log("Attempting to refresh token...");
  
      // Send the request to refresh endpoint; HttpOnly cookie will be sent automatically
      const response = await axios.post(
        "/refresh",
        {}, // No body required
        { withCredentials: true } // Send credentials, including HttpOnly cookies
      );
  
      const newAccessToken = response.data?.accessToken;
      console.log("New token received:", newAccessToken);
  
      if (!newAccessToken) {
        throw new Error("No access token returned by /refresh endpoint");
      }
  
      // Update auth context
      setAuth((prev) => ({
        ...prev,
        token: newAccessToken,
      }));
      console.log("Token has been refreshed and set in context:", newAccessToken);
  
      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing token:", error.message);
      throw error; // Rethrow error for the caller to handle
    }
  };
  

  return { refresh };
};

export default useRefreshToken;
