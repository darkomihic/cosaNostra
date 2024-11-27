import axios from "../api/axiosInstance";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
  
      // Send the request to refresh endpoint; HttpOnly cookie will be sent automatically
      const response = await axios.post(
        "/refresh",
        {}, // No body required
        { withCredentials: true } // Send credentials, including HttpOnly cookies
      );
  
      const newAccessToken = response.data?.accessToken;
  
      if (!newAccessToken) {
        throw new Error("No access token returned by /refresh endpoint");
      }
  
      // Update auth context
      setAuth((prev) => ({
        ...prev,
        token: newAccessToken,
      }));
  
      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing token:", error.message);
      throw error; // Rethrow error for the caller to handle
    }
  };
  

  return { refresh };
};

export default useRefreshToken;
