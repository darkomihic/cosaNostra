import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { jwtDecode  } from "jwt-decode";
import useAuth from '../hooks/useAuth';


export default function Schedule() {
  const { auth } = useAuth();
  const decoded = auth?.token ? jwtDecode(auth.token) : undefined;
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowDateString = tomorrow.toISOString().split('T')[0];
  const lastDay = new Date(today);
  lastDay.setDate(today.getDate() + 8);
  const lastDayString = lastDay.toISOString().split('T')[0];

  const isVIP = decoded?.isVIP?.data?.[0] === 1;

  useEffect(() => {


    if(isVIP) {
      fetchBarbers();
    } else {
      fetchBarbersNonVIP();
    }
    fetchServices();
  }, [auth.token]);
  const fetchBarbers = async () => {
    try {
      const response = await fetch('http://localhost:8080/barbers', {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      const data = await response.json(); 
      const filteredBarbers = Array.isArray(data) ? data.filter(barber => barber.available !== "None") : [];
      setBarbers(filteredBarbers);
      if (filteredBarbers.length === 0) {
        setError('Nema slobodan frizer');
      } else {
        setError('');
      }
    } catch (error) {
      console.error('Error fetching barbers:', error);
      setError('Failed to fetch barbers');
    }
  };
  const fetchBarbersNonVIP = async () => {
    try {
      const response = await fetch('http://localhost:8080/barbers', {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      const data = await response.json(); 
      const filteredBarbers = Array.isArray(data) ? data.filter(barber => barber.available === "All") : [];
      setBarbers(filteredBarbers);
      if (filteredBarbers.length === 0) {
        setError('Nema slobodan frizer');
      } else {
        setError('');
      }
    } catch (error) {
      console.error('Error fetching barbers:', error);
      setError('Failed to fetch barbers');
    }
  };
  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:8080/services');
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to fetch services');
    }
  };
  const handleBarberAndServiceSelect = async (e) => {
    e.preventDefault();

    if (selectedBarber && selectedService && selectedDate) {
      try {
        const response = await fetch(`http://localhost:8080/available-slots?barberId=${selectedBarber}&serviceId=${selectedService}&date=${selectedDate}`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        });
        const data = await response.json();
        setAvailableSlots(data);
      } catch (error) {
        console.error('Error fetching available slots:', error);
        setError('Failed to fetch available slots');
      }
    }
  };
  const vipPayment = async () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedSlot) {
      setError('Please select all required fields');
      return;
    }

    console.log("Service duration: " + await getServiceDuration(selectedService));


    const response = await fetch('http://localhost:8080/appointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        serviceId: selectedService,
        barberId: selectedBarber,
        appointmentDate: selectedDate,
        appointmentTime: dateToTime(selectedSlot),
        appointmentDuration: await getServiceDuration(selectedService),
        note: note,
        clientId: decoded.id

        
      })

      
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to create Checkout Session:', errorData.error);
      return;
    } else {
      navigate('/appointments');
    }


  }

  const getServiceDuration = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/services/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      const data = await response.json(); 
      const duration = data.serviceDuration;
      return duration;
    } catch (error) {
      console.error('Error fetching barbers:', error);
      setError('Failed to fetch barbers');
    }

  }

  const makePayment = async () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedSlot) {
      setError('Please select all required fields');
      return;
    }
  
    const response = await fetch('http://localhost:8080/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        serviceId: selectedService,
        barberId: selectedBarber,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot,
        note: note,
        //clientId: localStorage.getItem('clientId') // Assuming you store clientId in localStorage
      })
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to create Checkout Session:', errorData.error);
      return;
    }
  
    const session = await response.json();
  
    const stripe = await loadStripe("pk_test_51PP98SRxP15yUwgN35ZxmfdI3sBYz2B8hGEReLM387HBhlwJaGQ4PqhtgfD2YorNEsj2YpjYbkeYAwfnPRTZTNHY00KAQaZwPD");
  
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id
    });
  
    if (error) {
      console.error('Error redirecting to Checkout:', error);
    }
  };
  
  function dateToTime(date) {

    const date2 = new Date(date);

    const hours = date2.getUTCHours().toString().padStart(2, '0');
    const minutes = date2.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date2.getUTCSeconds().toString().padStart(2, '0');

    // Format time as HH:MM:SS
    const timeString = `${hours}:${minutes}:${seconds}`;

    return timeString;
  }

  function formatTime(time) {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

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
    <div className='min-h-screen flex flex-col justify-between bg-neutral-950'>
      <div className='m-auto h-auto shadow-lg shadow-neutral-900 bg-black p-6 sm:max-w-[900px] rounded-2xl'>
        <h2 className='text-4xl font-bold text-center mb-8 text-zinc-200'>Schedule a Haircut</h2>
        <form onSubmit={handleBarberAndServiceSelect}>
          <div className='mb-4'>
            <label className='block text-zinc-200 mb-2'>Select Barber:</label>
            <select
              className='w-full p-2 bg-zinc-200 text-black rounded-xl'
              value={selectedBarber}
              onChange={(e) => setSelectedBarber(e.target.value)}
              required
            >
              <option value='' disabled>Select a barber</option>
              {barbers.map((barber) => (
                <option key={barber.barberId} value={barber.barberId}>{barber.barberName} {barber.barberSurname}</option>
              ))}
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-zinc-200 mb-2'>Select Service:</label>
            <select
              className='w-full p-2 bg-zinc-200 text-black rounded-xl'
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              required
            >
              <option value='' disabled>Select a service</option>
              {services.map((service) => (
                <option key={service.serviceId} value={service.serviceId}>{service.serviceName} - {service.servicePrice}</option>
              ))}
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-zinc-200 mb-2'>Select Date:</label>
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
            <button className='w-full py-2 my-4 bg-zinc-200 hover:bg-neutral-800 text-black rounded-xl'>Check Availability</button>
          </div>
        </form>
        {availableSlots.length > 0 && (
          <div className='mb-4'>
            <label className='block text-zinc-200 mb-2'>Available Time Slots:</label>
            <select
              className='w-full p-2 bg-zinc-200 text-black rounded-xl'
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              required
            >
              <option value='' disabled>Select a time slot</option>
              {availableSlots.map((slot, index) => (
                <option key={index} value={`${slot.start}`}>
                  {formatTime(slot.start)}
                </option>
              ))}
            </select>
            <button
              className='w-full py-2 my-4 bg-zinc-200 hover:bg-neutral-800 text-black rounded-xl'
              onClick={makePayment}
            >
              Schedule Appointment
            </button>
            {decoded?.isVIP && (
              <button
                className='w-full py-2 my-4 bg-zinc-200 hover:bg-neutral-800 text-black rounded-xl'
                onClick={vipPayment}
              >
                Schedule Appointment (plati uzivo)
              </button>
            )}
          </div>
        )}
        {error && <p className='text-red-500'>{error}</p>}
        <form onSubmit={makePayment}>
          {/* Other input fields and submit button for scheduling the appointment */}
        </form>
      </div>
      <Footer className="mt-auto" />
    </div>
  );
}
