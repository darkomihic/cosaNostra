import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentCard from './AppointmentCard'; // Import your card component
import Footer from './Footer';
import { jwtDecode  } from "jwt-decode";
import useAuth from '../hooks/useAuth';

export default function Appointments() {
  const { auth } = useAuth();
  const decoded = auth?.token ? jwtDecode(auth.token) : undefined;

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API;


  useEffect(() => {
    fetchAllAppointmentsForClient();
  }, []);

  useEffect(() => {
    const result = filterPastAppointments(appointments);
    setFilteredAppointments(result);
  }, [appointments]);

  const fetchAllAppointmentsForClient = async () => {
    try {
      const clientId = decoded.id;
      console.log(`Fetching appointments for client ID: ${clientId}`);
      const response = await fetch(`${apiUrl}/appointment-details-client/${clientId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status); // Log the response status
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch appointments: ${errorText}`);
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
