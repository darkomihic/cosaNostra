import React, { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();



  useEffect(() => {
    fetchAllAppointmentsForClient();
    const result = filterPastAppointments(appointments);
    setFilteredAppointments(result);  }, [appointments]);

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
      console.error("Error fetching appointments:", error);
      setError(error.message);
    }
  };

  const convertTime = (timeString) => {
    const timeParts = timeString.split(':');
    const convertedTime = timeParts.slice(0, 2).join(':');
  
    return convertedTime;
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  };

  const handleButtonClick = () => {
    navigate('/');
  };

  const filterPastAppointments = (appointments) => {
    const currentDate = new Date();
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return appointmentDate >= currentDate;
    });
  };

  return (
    <div className="bg-gray-900 text-gray-500 min-h-screen flex flex-col items-center pt-10">
      <h2 className="text-4xl font-bold mb-4">Appointments</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="mt-4 w-full max-w-screen-lg">
        <div className="overflow-x-auto border rounded-md">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead>
              <tr className="border-gray-700 text-2xl">
                <th className="px-3 py-2 text-center">Date</th>
                <th className="px-3 py-2 text-center">Time</th>
                <th className="px-3 py-2 text-center">Barber Name</th>
                <th className="px-3 py-2 text-center">Service</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.appointmentId} className="border-gray-700 text-2xl">
                  <td className="px-3 py-2 text-center">{formatDate(appointment.appointmentDate)}</td>
                  <td className="px-3 py-2 text-center">{convertTime(appointment.appointmentTime)}</td>
                  <td className="px-3 py-2 text-center">{`${appointment.barberName} ${appointment.barberSurname}`}</td>
                  <td className="px-3 py-2 text-center">{appointment.serviceName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleButtonClick}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg text-lg hover:bg-gray-700"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
  
  
  
  
  
  
}