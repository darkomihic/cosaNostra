import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import Footer from './Footer';
import useAuth from '../hooks/useAuth';  // Import the custom hook
import axiosPrivate from '../api/axiosInstance';  // axios instance with interceptors applied


export default function BarberLogin() {

  const [barberUsername, setUsername] = useState('');
  const [barberPassword, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const apiUrl = process.env.REACT_APP_API;





  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      // Send the login request using axios
      const response = await axiosPrivate.post(`${apiUrl}/barberlogin`, {
        barberUsername,
        barberPassword
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Handle successful login response
      const { token } = response.data;  // Access the token directly from the response data
      console.log("token: " + token);
      
      setAuth({ token });
      navigate('/barber-dashboard'); 
    } catch (error) {
      // Handle errors in the request or response
      console.error('Error logging in:', error);
      
      // Check if error is related to response
      if (error.response) {
        // If there's an error response from the server
        setError(error.response.data.message || 'Failed to login');
      } else {
        // If there was an issue with the request itself
        setError('Failed to login');
      }
    }
  };
  



  return (
    <div className="w-full h-screen flex bg-neutral-950">
      <div className="m-auto h-auto shadow-lg shadow-gray-1000 sm:max-w-[400px] bg-black p-6">
        <h2 className="text-2xl font-bold text-center mb-8 text-white">Barber Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-white mb-2">Username:</label>
            <input
              type="text"
              className="w-full p-2 bg-gray-700 text-white"
              value={barberUsername}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Password:</label>
            <input
              type="password"
              className="w-full p-2 bg-gray-700 text-white"
              value={barberPassword}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-2 my-4 bg-custom-color hover:bg-custom-color2 text-white">Login</button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <Footer/>
    </div>
  );
}
