import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentCard from './AppointmentCard'; // Import your card component
import Footer from './Footer';
import { jwtDecode  } from "jwt-decode";
import useAuth from '../hooks/useAuth';  // Import the custom hook
import useAxiosPrivate from '../hooks/useAxiosPrivate';


export default function Appointments() {
  const { auth } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API;
  const axiosPrivate = useAxiosPrivate();

  let decoded = auth?.token ? jwtDecode(auth.token) : undefined;



  useEffect(() => {
    console.log("Auth.token:", auth?.token);
  
    try {
      const decoded = auth?.token ? jwtDecode(auth.token) : null;
      console.log("Decoded Token:", decoded);
  
      if (decoded?.id) {
        fetchAllAppointmentsForClient();
        const result = filterPastAppointments(appointments);
        setFilteredAppointments(result);
      } else {
        console.error("Decoded token does not contain 'id'");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, [auth.token]);
  


  
  const fetchAllAppointmentsForClient = async () => {
    try {
      const data = await fetchAppointments(decoded.id); // Make sure decoded is available here
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError(error.message);
    }
  };
  const fetchAppointments = async (clientId) => {
    const url = `${apiUrl}/appointment-details-client/${clientId}`;
    try {
      const response = await axiosPrivate.get(url);  // Now using the axiosPrivate hook
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
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
