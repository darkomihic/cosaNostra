import React, { useState, useEffect } from 'react';
import newLogo from '../assets/ikona_processed.jpg';
import Map from '../assets/mappin.png';
import Phone from '../assets/telephone.png';
import useAuth from '../hooks/useAuth';
import ServicesTable from './ServicesTable';
import Footer from './Footer';
import axios from 'axios';


export default function HeroLandingPage() {
  const { auth } = useAuth();

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
  const apiUrl = process.env.REACT_APP_API;


  useEffect(() => {
    // Fetch services using axios
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${apiUrl}/services`);
        setServices(response.data); // Set services data from the response
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
  
    fetchServices(); // Call the function to fetch services
  }, []);
  
  useEffect(() => {
    if (auth.token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [auth.token]);
  return (
    <div className="bg-black min-h-screen flex flex-col justify-between">
      <div>
        <section className="bg-[#141414] bg-opacity-30 py-10 sm:py-16 lg:py-24">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <p className="text-4xl font-semibold tracking-wider text-zinc-200">Dobro došli u</p>
                <h1 className="mt-2 text-4xl font-bold text-zinc-200 lg:mt-4 sm:text-6xl xl:text-6xl">Frizerski salon</h1>
                <h1 className="text-4xl font-bold text-zinc-200 sm:text-6xl mb-2 xl:text-8xl">Kosa Nostra</h1>
              </div>
              <div className="items-center hidden lg:flex lg:justify-end lg:mr-14">
                <img src={newLogo} alt="Logo" className="sm:w-96 sm:h-96 md:w-128 lg:w-128" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src={Map}
                alt="Map"
                className="w-8 h-8 object-cover rounded"
              />
              <p className="text-2xl font-bold text-zinc-200">
                Todora Toze Jovanovića 8
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
              <img src={newLogo} alt="Logo" className="w-48 h-auto" />
            </div>
          </div>
        </section>
        <ServicesTable />
      </div>
      <Footer/>
    </div>
  );
}
