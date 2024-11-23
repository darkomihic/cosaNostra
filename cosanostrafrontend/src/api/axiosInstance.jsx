import axios from 'axios';

// Create the axios instance for private requests
const axiosPrivate = axios.create({
  baseURL: process.env.REACT_APP_API, // API base URL from environment variable
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for cross-origin requests if needed
});

export default axiosPrivate;
