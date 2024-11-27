import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from "../../hooks/useAuth";  // Import the custom hook
import { jwtDecode  } from "jwt-decode";
import Footer from '../Footer';
import { useNavigate } from 'react-router-dom';


export default function BarberCreateAppointment() {
  const [services, setServices] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const apiUrl = process.env.REACT_APP_API;
  const [selectedService, setSelectedService] = useState('');
  const { auth } = useAuth();
  const [availableSlots, setAvailableSlots] = useState([]);
  const [note] = useState('');
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const navigate = useNavigate();
  const today = new Date();
  const tomorrow = new Date(today);
  const tomorrowDateString = tomorrow.toISOString().split('T')[0];
  const lastDay = new Date(today);
  const lastDayString = lastDay.toISOString().split('T')[0];

  let decoded = auth?.token ? jwtDecode(auth.token) : undefined;


  useEffect(() => {

    decoded = auth?.token ? jwtDecode(auth.token) : undefined;

    fetchServices();
  }, [auth.token]);

  const fetchServices = async () => {
    try {
      const response = await axiosPrivate.get(`${apiUrl}/services`);
      setServices(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to fetch services');
    }
  };

  const handleBarberAndServiceSelect = async (e) => {
    e.preventDefault();
  
    if (selectedService && selectedDate) {
      try {
        const response = await axiosPrivate.get(`${apiUrl}/available-slots`, {
          params: {
            barberId: decoded.id,
            serviceId: selectedService,
            date: selectedDate,
          },
          headers: {
            'Authorization': `Bearer ${auth.token}`,
          },
        });
        setAvailableSlots(response.data);
      } catch (error) {
        console.error('Error fetching available slots:', error);
        setError('Failed to fetch available slots');
      }
    }
  };

  const createAppointment = async () => {
    if (!selectedService || !selectedDate || !selectedSlot) {
      setError('Please select all required fields');
      return;
    }
  
  
    try {
      const response = await axiosPrivate.post(
        `${apiUrl}/appointment`,
        {
          serviceId: selectedService,
          barberId: decoded.id,
          appointmentDate: selectedDate,
          appointmentTime: dateToTime(selectedSlot),
          appointmentDuration: await getServiceDuration(selectedService),
          note: note,
          clientId: null,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`,
          },
        }
      );
  
      if (response.status === 201) {
        navigate('/appointments');
      } else {
        console.error('Unexpected response:', response);
        setError('Failed to schedule the appointment');
      }
    } catch (error) {
      console.error('Failed to create appointment:', error.response?.data?.error || error);
      setError('Error occurred while scheduling the appointment');
    }
  };
  
  
  const getServiceDuration = async (id) => {
    try {
      const response = await axiosPrivate.get(`${apiUrl}/services/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      return response.data.serviceDuration;
    } catch (error) {
      console.error('Error fetching service duration:', error);
      setError('Failed to fetch barbers');
    }
  };

  function dateToTime(date) {
    const date2 = new Date(date);
  
    if (isNaN(date2.getTime())) {
      console.error('Invalid date:', date);
      return null; // or handle it as per your need
    }
  
    const hours = date2.getUTCHours().toString().padStart(2, '0');
    const minutes = date2.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date2.getUTCSeconds().toString().padStart(2, '0');
  
    return `${hours}:${minutes}:${seconds}`;
  }
  

  const formatTime = (time) => {
    const date = new Date(time);
    
    // Subtract one hour
    date.setHours(date.getHours() - 1);
  
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  

  const handleDateChange = (e) => {
    const selected = e.target.value;
    if (selected < today) {
      setError('Please select a date after today.');
    } else {
      setError('');
      setSelectedDate(selected);
    }
    setAvailableSlots([]); // Clear available slots when the date is changed
  };

  return (
    <>
      <div className='min-h-screen flex flex-col justify-between bg-neutral-950'>
      <div className='m-auto h-auto shadow-lg shadow-neutral-900 bg-black p-6 sm:max-w-[900px] rounded-2xl'>
        <h2 className='text-4xl font-bold text-center mb-8 text-zinc-200'>Kreiraj termin</h2>
        <form onSubmit={handleBarberAndServiceSelect}>
          <div className='mb-4'>
            <label className='block text-zinc-200 mb-2'>Izaberi uslugu:</label>
            <select
              className='w-full p-2 bg-zinc-200 text-black rounded-xl'
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              required
            >
              <option value='' disabled>Usluga</option>
              {services.map((service) => (
                <option key={service.serviceId} value={service.serviceId}>{service.serviceName} - {service.servicePrice}</option>
              ))}
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-zinc-200 mb-2'>Izaberi datum:</label>
            <input
              type='date'
              className='w-full p-2 bg-zinc-200 text-black rounded-xl'
              value={selectedDate}
              onChange={handleDateChange}
              min={tomorrowDateString}
              max={lastDayString}
              required
            />
          </div>
          <div className='mb-4'>
            <button className='w-full py-2 my-4 bg-zinc-200 hover:bg-neutral-800 text-black rounded-xl'>Pogledaj dostupnu satnicu</button>
          </div>
        </form>
        {availableSlots.length > 0 && (
          <div className='mb-4'>
            <label className='block text-zinc-200 mb-2'>Izaberi vreme:</label>
            <select
              className='w-full p-2 bg-zinc-200 text-black rounded-xl'
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              required
            >
              <option value='' disabled>Termini</option>
              {availableSlots.map((slot, index) => (
              <option key={index} value={`${slot.start}`}>
                {formatTime(new Date(slot.start))} {/* Ensure slot.start is valid */}
              </option>
            ))}

            </select>
            <button
              className='w-full py-2 my-4 bg-zinc-200 hover:bg-neutral-800 text-black rounded-xl'
              onClick={createAppointment}
            >
              Zakaži termin
            </button>
          </div>
        )}
        {error && <p className='text-red-500'>{error}</p>}
        <form onSubmit={createAppointment}>
          {/* Other input fields and submit button for scheduling the appointment */}
        </form>
      </div>
      <Footer className="mt-auto" />
    </div>
    </>
  )

}