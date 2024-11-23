import axios from 'axios';

export default axios.create({
  baseURL: process.env.REACT_APP_API, // API base URL from environment variable
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create the axios instance for private requests
export const axiosPrivate = axios.create({
  baseURL: process.env.REACT_APP_API, // API base URL from environment variable
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for cross-origin requests if needed
});

