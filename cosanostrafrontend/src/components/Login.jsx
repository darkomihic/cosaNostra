import React, { useState } from 'react';
import shopicon from '../assets/ikona.jpg';
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

<div className='min-h-screen flex flex-col justify-between bg-neutral-950'>
  <div className='grid grid-cols-1 md:grid-cols-2 m-auto h-auto md:h-[550px] shadow-lg shadow-neutral-900 sm:max-w-[900px] bg-black rounded-2xl'>
    {/* For small screens, the image will be on top; for larger screens, it will be side by side */}
    <div className='w-full h-full md:h-auto flex justify-center md:justify-start items-center'>
      <img className='w-full h-64 md:w-auto md:h-48 object-contain rounded-t-2xl md:rounded-l-2xl' src={shopicon} alt='Shop icon' />
    </div>

    <div className='p-4 flex flex-col justify-around'>
      <form className='flex flex-col items-center' onSubmit={handleLogin}>
        <div className='flex flex-col sm:flex-row sm:space-x-2 mb-4'>
          <input className='border p-2 mb-2 sm:mb-0 bg-zinc-200 text-black rounded-xl' type='text' placeholder='Korisničko ime' value={clientUsername} onChange={(e) => setUsername(e.target.value)} />
          <input className='border p-2 bg-zinc-200 text-black rounded-xl' type='password' placeholder='Šifra' value={clientPassword} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button className='w-48 py-2 my-4 bg-zinc-200 hover:bg-neutral-800 text-black rounded-xl mx-auto'>Prijavi se</button>
        <Link to="/register" className="text-center text-white font-bold">Kreiraj nalog</Link>
      </form>
      <Link to="/" className="text-center text-zinc-200 font-bold sm: pt-4">Nazad na početnu stranicu</Link>
    </div>
  </div>
  <Footer className="mt-auto" />
</div>



  );
}
