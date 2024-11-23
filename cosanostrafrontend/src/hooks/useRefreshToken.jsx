import axios from "../api/axiosInstance";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      console.log("Attempting to refresh token...");
      const response = await axios.post("/refresh", {
        withCredentials: true, // Ensure this matches your API's expectations
      });

      const newAccessToken = response.data?.accessToken;
      console.log("New token received:", newAccessToken);

      if (!newAccessToken) {
        throw new Error("No access token returned by /refresh endpoint");
      }

      // Update the auth context
      setAuth((prev) => ({
        ...prev,
        token: newAccessToken,
      }));
      console.log("Token has been refreshed and set in context:", newAccessToken);

      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing token:", error.message);
      throw error; // Rethrow the error for the caller to handle
    }
  };

  return refresh;
};

export default useRefreshToken;
