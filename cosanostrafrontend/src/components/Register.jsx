import React, { useState } from 'react';
import shopicon from '../assets/ikona.jpg';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import axiosPrivate from '../api/axiosInstance';  // axios instance with interceptors applied
import axios from 'axios'
import useAuth from '../hooks/useAuth'; // Ensure correct path


export default function Register({setIsAuthenticated}) {
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
  const { setAuth } = useAuth();
  const apiUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_API_LOCAL // Use local API in development
    : process.env.REACT_APP_API;      // Use production API in production


  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        // Send the registration request using axios
        const response = await axiosPrivate.post(`${apiUrl}/register`, {
          clientUsername,
          clientPassword,
          clientName,
          clientSurname,
          clientPhone,
          clientEmail,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        // Handle successful registration
        if (response.status === 200 || response.status === 201) {
          try {
            const response = await axios.post(`${apiUrl}/login`, {
              clientUsername,
              clientPassword
            }, {
              headers: {
                'Content-Type': 'application/json',
              }
            })
            const { accessToken } = response.data; // Directly access the accessToken from response.data
      
            // Store the accessToken in your auth state
            setAuth({ token: accessToken });
            //setIsAuthenticated(true); // Update the state on successful logout
            navigate('/');
          } catch(error) {
            console.error('Error:', error);
  
            // Check if error is related to response
            if (error.response) {
              // If there's an error response from the server
              setError(error.response.data.message || 'An unexpected error occurred');
            } else {
              // If there was an issue with the request itself (e.g., network issue)
              setError('An unexpected error occurred');
            }
          }
          
        }
      } catch (error) {
        // Handle errors in the request or response
        console.error('Error:', error);
  
        // Check if error is related to response
        if (error.response) {
          // If there's an error response from the server
          setError(error.response.data.message || 'An unexpected error occurred');
        } else {
          // If there was an issue with the request itself (e.g., network issue)
          setError('An unexpected error occurred');
        }
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
<div className='min-h-screen flex flex-col justify-between pt-6 bg-neutral-950'>
  <div className='grid grid-cols-1 md:grid-cols-2 m-auto h-auto md:h-[550px] shadow-lg shadow-neutral-900 sm:max-w-[900px] bg-black rounded-2xl'>
    {/* For small screens, the image will be on top; for larger screens, it will be side by side */}
    <div className='w-full h-full md:h-auto flex justify-center md:justify-start items-center'>
      <img className='w-full h-64 lg:w-auto lg:h-auto object-contain rounded-t-2xl lg:rounded-l-2xl' src={shopicon} alt='Shop icon' />
    </div>

    <div className='p-4 flex flex-col justify-around'>
      <form className='flex flex-col items-center space-y-4' onSubmit={handleRegister}>

        <input className='border p-2 bg-zinc-200 text-black rounded-xl w-full' type='text' placeholder='Korisničko ime' value={clientUsername} onChange={(e) => setUsername(e.target.value)} />
        {errors.username && <p className='text-red-500'>{errors.username}</p>}

        <input className='border p-2 bg-zinc-200 text-black rounded-xl w-full' type='text' placeholder='Broj telefona' value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />

        <input className='border p-2 bg-zinc-200 text-black rounded-xl w-full' type='password' placeholder='Lozinka' value={clientPassword} onChange={(e) => setPassword(e.target.value)} />
        {errors.password && <p className='text-red-500'>{errors.password}</p>}

        <input className='border p-2 bg-zinc-200 text-black rounded-xl w-full' type='password' placeholder='Ponovi lozinku' value={repeatedPassword} onChange={(e) => setRepeatedPassword(e.target.value)} />
        {errors.confirmPassword && <p className='text-red-500'>{errors.confirmPassword}</p>}

        <input className='border p-2 bg-zinc-200 text-black rounded-xl w-full' type='text' placeholder='Ime' value={clientName} onChange={(e) => setName(e.target.value)} />

        <input className='border p-2 bg-zinc-200 text-black rounded-xl w-full' type='text' placeholder='Prezime' value={clientSurname} onChange={(e) => setSurname(e.target.value)} />

        <input className='border p-2 bg-zinc-200 text-black rounded-xl w-full' type='email' placeholder='E-Mail' value={clientEmail} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <p className='text-red-500'>{errors.email}</p>}

        {error && <p className='text-red-500'>{error}</p>}

        <button className='w-48 py-2 my-4 bg-zinc-200 hover:bg-neutral-800 text-black font-bold rounded-xl mx-auto'>Kreiraj nalog</button>
      </form>
    </div>
  </div>
  <Footer className="mt-auto" />
</div>

  );
}
