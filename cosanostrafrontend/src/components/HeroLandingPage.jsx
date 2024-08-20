import React, { useState, useEffect } from 'react';
import Logo from '../assets/barbershopicon.jpg';
import Map from '../assets/mappin.png';
import Phone from '../assets/telephone.png';


import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import ServicesTable from './ServicesTable';

export default function HeroLandingPage() {
  const workingHours = [
    { day: 'Monday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Tuesday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Wednesday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Thursday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Friday', hours: '9:00 AM - 8:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
  ];


  const [services, setServices] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  

  useEffect(() => {
    fetch('http://localhost:8080/services')
      .then(response => response.json())
      .then(data => setServices(data))
      .catch(error => console.error('Error fetching services:', error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    localStorage.removeItem('barberToken');
    localStorage.removeItem('barberId');
  }, []);



  return (
    <div className="bg-black">
      <section className="bg-[#141414] bg-opacity-30 py-10 sm:py-16 lg:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <p className="text-4xl font-semibold tracking-wider text-zinc-200">Dobro došli u</p>
              <h1 className="mt-2 text-4xl font-bold text-zinc-200 lg:mt-8 sm:text-6xl xl:text-6xl">Frizerski salon</h1>
              <h1 className="text-4xl font-bold text-zinc-200 sm:text-6xl xl:text-8xl">Kosa Nostra</h1>
            </div>
            <div className="items-center hidden lg:flex lg:justify-end lg:mr-14">
              <img src={Logo} alt="Logo" className="sm:w-96 sm:h-96 md:w-128 lg:w-128 xl:w-128 h-auto" />
            </div>

          </div>
          <div className="flex items-center space-x-2 mt-2">
            <img
              src={Map}
              alt="Map"
              className="w-8 h-8 object-cover rounded"
            />
            <p className="text-2xl font-bold text-zinc-200">
              Adresa 20
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <img
              src={Phone}
              alt="Phone"
              className="w-6 h-6 object-cover rounded ml-1"
            />
            <p className="text-2xl font-bold text-zinc-200">
              069123456
            </p>
          </div>
          <div className="lg:hidden mt-8 flex justify-center items-center">
            <img src={Logo} alt="Logo" className="w-48 h-auto" /> {/* Adjust size as needed */}
          </div>
        </div>
      </section>
      <ServicesTable></ServicesTable>
    </div>
  );
  
}
