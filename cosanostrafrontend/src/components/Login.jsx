import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Login({ onLogin }) {
  const [clientUsername, setUsername] = useState('');
  const [clientPassword, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const apiUrl = process.env.REACT_APP_API;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientUsername, clientPassword }),
      });

      if (response.ok) {
        const responseData = await response.json(); // Parse the response
        const { accessToken, refreshToken } = responseData; // Destructure both tokens
        console.log("Access Token: " + accessToken);
        console.log("Refresh Token: " + refreshToken);

        // Store access token in context
        setAuth({ accessToken });

        // Store accessToken and refreshToken in sessionStorage for persistence after page reload
        sessionStorage.setItem('auth', JSON.stringify({ accessToken, refreshToken }));

        // Optionally store refreshToken in cookies for long-term use
        document.cookie = `refreshToken=${refreshToken}; path=/; HttpOnly`;

        // Call onLogin if provided (triggering navbar update)
        if (onLogin) onLogin();

        navigate('/');  // Redirect to homepage after successful login
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className='min-h-screen flex flex-col justify-between bg-neutral-950'>
      <div className='grid grid-cols-1 lg:grid-cols-2 m-auto h-auto lg:h-[550px] shadow-lg shadow-neutral-900 sm:max-w-[900px] bg-black rounded-2xl'>
        <div className='w-full h-full lg:h-auto flex justify-center items-center'>
          <img className='w-full h-64 lg:w-auto lg:h-auto object-contain rounded-t-2xl lg:rounded-l-2xl' src="/path/to/your/image" alt='Shop icon' />
        </div>

        <div className="p-4 lg:pr-24 pr-0 flex flex-col justify-around">
          <p className="text-4xl font-semibold tracking-wider self-center mt-8 text-zinc-200 hidden sm:hidden md:hidden lg:block">Prijavi se</p>
          <form className='flex flex-col items-center' onSubmit={handleLogin}>
            <div className='flex flex-col sm:flex-row sm:space-x-2 mb-4'>
              <input 
                className='border p-2 mb-2 sm:mb-0 bg-zinc-200 text-black rounded-xl' 
                type='text' 
                placeholder='Korisničko ime' 
                value={clientUsername} 
                onChange={(e) => setUsername(e.target.value)} 
              />
              <input 
                className='border p-2 bg-zinc-200 text-black rounded-xl' 
                type='password' 
                placeholder='Šifra' 
                value={clientPassword} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button className='w-48 py-2 my-4 bg-zinc-200 hover:bg-neutral-800 text-black rounded-xl font-bold mx-auto'>Prijavi se</button>
            <Link to="/register" className="text-center text-white font-bold">Kreiraj nalog</Link>
          </form>
          <Link to="/" className="text-center text-zinc-200 font-bold sm: pt-4">Nazad na početnu stranicu</Link>
        </div>
      </div>
    </div>
  );
}
