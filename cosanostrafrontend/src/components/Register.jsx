import React, { useState } from 'react';
import shopicon from '../assets/barbershopicon.jpg';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [clientUsername, setUsername] = useState('');
  const [clientPassword, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [clientEmail, setEmail] = useState('');
  const [clientName, setName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientSurname, setSurname] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Form submitted successfully');
      try {
        const response = await fetch('http://localhost:8080/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ clientUsername, clientPassword, clientName, clientSurname, clientPhone, clientEmail }),
        });
  
        if (response.ok) {
          navigate('/login');
        } else {
          const data = await response.json();
          setError(data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('An unexpected error occurred');
      }
    }
  };

  const validateForm = () => {
    let formErrors = {};
    if (clientUsername.length < 3 || clientUsername.length > 15) {
      formErrors.username = 'Username must be between 3 and 15 characters';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(clientEmail)) {
      formErrors.email = 'Invalid email format';
    }
    if (clientPassword.length < 6 || clientPassword.length > 20) {
      formErrors.password = 'Password must be between 6 and 20 characters';
    }
    if (repeatedPassword !== clientPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  return (
    <div className='min-h-screen flex bg-neutral-950'>
  <div className='grid grid-cols-1 md:grid-cols-2 m-auto shadow-lg shadow-gray-1000 sm:max-w-[900px] bg-black'>
    <div className='w-full h-full md:h-auto'>
      <img className='w-full h-full object-contain' src={shopicon} alt='Shop icon' />
    </div>
    <div className='p-4 flex flex-col justify-center'>
      <form onSubmit={handleRegister} className="space-y-4">
        <h2 className='text-4xl font-bold text-center mb-8 text-white'>Cosa Nostra</h2>
        <div className='flex flex-col'>
          <input
            className='border p-2 mb-1 bg-neutral-700 text-white'
            type='text'
            placeholder='Username'
            value={clientUsername}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <p className='text-red-500'>{errors.username}</p>}
        </div>
        <div className='flex flex-col'>
          <input
            className='border p-2 mb-1 bg-neutral-700 text-white'
            type='text'
            placeholder='Phone number'
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
          />
        </div>
        <div className='flex flex-col'>
          <input
            className='border p-2 mb-1 bg-neutral-700 text-white'
            type='password'
            placeholder='Password'
            value={clientPassword}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className='text-red-500'>{errors.password}</p>}
        </div>
        <div className='flex flex-col'>
          <input
            className='border p-2 mb-1 bg-neutral-700 text-white'
            type='password'
            placeholder='Repeat Password'
            value={repeatedPassword}
            onChange={(e) => setRepeatedPassword(e.target.value)}
          />
          {errors.confirmPassword && <p className='text-red-500'>{errors.confirmPassword}</p>}
        </div>
        <div className='flex flex-col'>
          <input
            className='border p-2 mb-1 bg-neutral-700 text-white'
            type='text'
            placeholder='Name'
            value={clientName}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='flex flex-col'>
          <input
            className='border p-2 mb-1 bg-neutral-700 text-white'
            type='text'
            placeholder='Surname'
            value={clientSurname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </div>
        <div className='flex flex-col'>
          <input
            className='border p-2 mb-1 bg-neutral-700 text-white'
            type='text'
            placeholder='E-Mail'
            value={clientEmail}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className='text-red-500'>{errors.email}</p>}
        </div>
        {error && <p className='text-red-500'>{error}</p>}
        <button className='w-full py-2 my-4 bg-neutral-600 hover:bg-neutral-800 text-white'>
          Create account
        </button>
      </form>
      <Link to="/" className="text-center text-white font-bold">Back to Home</Link>
    </div>
  </div>
</div>
  );
}
