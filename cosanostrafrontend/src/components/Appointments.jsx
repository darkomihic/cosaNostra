import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentCard from './AppointmentCard'; // Import your card component
import Footer from './Footer';
import Cookies from 'js-cookie';


export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
    
    fetchAllAppointmentsForClient(); // Fetch after logging the tokens
  }, []);
  

  useEffect(() => {
    const result = filterPastAppointments(appointments);
    setFilteredAppointments(result);
  }, [appointments]);

  const fetchAllAppointmentsForClient = async () => {
    try {
      const clientId = localStorage.clientId;
      const response = await fetch(`http://localhost:8080/appointment-details-client/${clientId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError(error.message);
    }
  };

  const convertTime = (timeString) => {
    const timeParts = timeString.split(':');
    return timeParts.slice(0, 2).join(':');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  };

  const filterPastAppointments = (appointments) => {
    const currentDate = new Date();
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return appointmentDate >= currentDate;
    });
  };

  const handleButtonClick = () => {
    navigate('/');
  };

  return (
<div className="bg-neutral-950 text-zinc-200 min-h-screen flex flex-col">
  <div className="flex-grow flex flex-col items-center pt-10">
    <h2 className="text-4xl font-bold mb-4">Termini</h2>
    {error && <p className="text-red-500 text-center">{error}</p>}
    <div className="mt-4 w-full max-w-screen-lg">
      {filteredAppointments.length > 0 ? (
        filteredAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.appointmentId}
            barberName={appointment.barberName}
            barberSurname={appointment.barberSurname}
            appointmentDate={formatDate(appointment.appointmentDate)}
            appointmentTime={convertTime(appointment.appointmentTime)}
            serviceName={appointment.serviceName}
          />
        ))
      ) : (
        <p className="text-center">Nema zakazanih termina.</p>
      )}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleButtonClick}
          className="bg-zinc-200 text-black py-2 px-4 rounded-lg text-lg hover:bg-gray-700"
        >
          Početna stranica
        </button>
      </div>
    </div>
  </div>
  <Footer className="mt-auto w-full" />
</div>


  )};
