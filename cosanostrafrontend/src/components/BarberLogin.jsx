import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import Footer from './Footer';
import useAuth from '../hooks/useAuth';


export default function BarberLogin() {

  const [barberUsername, setUsername] = useState('');
  const [barberPassword, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useAuth();



  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/barberlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barberUsername, barberPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to login');
        return;
      }

      const responseData = await response.json(); // Parse the response
      const token = responseData.token; // Access the token
      console.log("token: " + token);
      setAuth({ token });
      navigate('/barber-dashboard'); 
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Failed to login');
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
