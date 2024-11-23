import axios from 'axios';

const apiUrl = process.env.REACT_APP_API;


// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: apiUrl, // Replace with your API's base URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for cross-origin requests if needed
});



// Add a response interceptor (for refresh token logic)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true; // Prevent infinite retry loop
      try {
        // Refresh the token
        const { data } = await axios.post(`${apiUrl}/refresh`, {}, { withCredentials: true });
        //localStorage.setItem('accessToken', data.accessToken);
        axiosInstance.defaults.headers.Authorization = `Bearer ${data.accessToken}`;

        // Retry the original request
        error.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosInstance(error.config);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
