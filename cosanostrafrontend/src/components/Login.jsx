import React, { useState } from 'react';
import shopicon from '../assets/barbershopicon.jpg';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';

export default function Login({ onLogin }) {
  const [clientUsername, setUsername] = useState('');
  const [clientPassword, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientUsername, clientPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, clientId, isVIP } = data;
        localStorage.setItem('token', token); 
        localStorage.setItem('clientId', clientId); 
        localStorage.setItem('isVIP', isVIP.data[0]);
        onLogin();  // Trigger re-render of Navbar
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className='min-h-screen flex flex-c justify-between bg-neutral-950'>
      <div className='grid grid-cols-1 md:grid-cols-2 m-auto h-[550px] shadow-lg shadow-neutral-600 sm:max-w-[900px] bg-black'>
        <div className='w-full h-[550px] hidden md:block'>
          <img className='w-full' src={shopicon} alt='Shop icon' />
        </div>
        <div className='p-4 flex flex-col justify-around'>
          <form onSubmit={handleLogin}>
            <h2 className='text-4xl font-bold text-center mb-8 text-white'>Cosa Nostra</h2>
            <div className='flex'>
              <input className='border p-2 mr-2 bg-neutral-700 text-white' type='text' placeholder='Username' value={clientUsername} onChange={(e) => setUsername(e.target.value)} />
              <input className='border p-2 mr-2 bg-neutral-700 text-white' type='password' placeholder='Password' value={clientPassword} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button className='w-full py-2 my-4 bg-neutral-600 hover:bg-neutral-800 text-white'>Sign in</button>
          </form>
          <Link to="/register" className="text-center text-white font-bold">Sign up</Link>
          <Link to="/" className="text-center text-white font-bold">Back to Home</Link>
        </div>
      </div>
      <Footer/>
    </div>

  );
}
