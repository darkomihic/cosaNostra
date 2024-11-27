import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { jwtDecode } from "jwt-decode";
import useAuth from '../../hooks/useAuth';  // Import the custom hook
import BarberAvaialability from './BarberAvailability';
import BarberVipHandling from './BarberVIPHandling';
import BarberBreakHandler from './BarberBreakHandler';
import BarberMultipleDayBreak from './BarberMultipleDayBreak';

export default function BarberDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');


  const { auth } = useAuth();
  const decoded = auth?.token ? jwtDecode(auth.token) : undefined;
  const apiUrl = process.env.REACT_APP_API;

  useEffect(() => {
    fetchAllAppointmentsForBarber();
  }, []);

  function calculateEndTime(startTime, durationInMinutes) {
    // Ensure startTime is in the correct format (HH:MM:SS)
    const timeParts = startTime.split(':');
    if (timeParts.length !== 3) {
      throw new Error('Invalid time format. Expected HH:MM:SS.');
    }
  
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);
  
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      throw new Error('Invalid hours, minutes, or seconds.');
    }
  
    // Create a Date object for the start time with a fixed date
    const startDate = new Date();
    startDate.setHours(hours);
    startDate.setMinutes(minutes);
    startDate.setSeconds(seconds);
    startDate.setMilliseconds(0);
  
    // Debug: Log the initial Date object
  
    // Add the duration
    startDate.setMinutes(startDate.getMinutes() + durationInMinutes);
  
    // Debug: Log the Date object after adding duration
  
    // Format the end time
    const endHours = startDate.getHours().toString().padStart(2, '0');
    const endMinutes = startDate.getMinutes().toString().padStart(2, '0');
  
    return `${endHours}:${endMinutes}`;
  }
  
  const fetchAllAppointmentsForBarber = async () => {
    try {
      const barberId = decoded.id;
      const response = await fetch(`${apiUrl}/appointment-details/${barberId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      const sortedAppointments = data.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

      setAppointments(sortedAppointments);
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


  const deleteAppointment = async (appointmentId) => {
    if (!appointmentId) {
      console.error('Invalid appointmentId:', appointmentId);
      setError('Invalid appointment ID');
      return;
    }
  
    try {
      const response = await fetch(`${apiUrl}/appointment/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }
  
      // Update state to remove the deleted appointment
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.appointmentId !== appointmentId)
      );
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setError(error.message);
    }
  };
  
  

  
  return (
  <div className="p-4 sm:p-6 bg-neutral-950 text-white">
  <h2 className="text-xl sm:text-2xl font-bold mb-4">Barber Dashboard</h2>
  {error && <p className="text-red-500 mb-4">{error}</p>}
  <BarberAvaialability />
  <BarberVipHandling setError={setError} />
  <div className="mt-4">
    <BarberBreakHandler
      setError={setError}
      fetchAllAppointmentsForBarber={fetchAllAppointmentsForBarber}
    />
  </div>
  <BarberMultipleDayBreak
    setError={setError}
    fetchAllAppointmentsForBarber={fetchAllAppointmentsForBarber}
  />
  <div className="mt-6">
      <h3 className="text-lg sm:text-xl font-semibold mb-2">Appointments</h3>
      <div className="overflow-auto border border-neutral-700 rounded-md">
        <table className="w-full table-auto text-sm sm:text-base">
          <thead className="bg-neutral-800">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Client Name</th>
              <th className="px-4 py-2 text-left">Service</th>
              <th className="px-4 py-2 text-left">Remove</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr
                key={appointment.appointmentId}
                className="border-b border-neutral-700"
              >
                <td className="px-4 py-2">
                  {appointment.appointmentDate
                    ? formatDate(appointment.appointmentDate)
                    : "N/A"}
                </td>
                <td className="px-4 py-2">
                  {appointment.appointmentTime
                    ? convertTime(appointment.appointmentTime)
                    : "N/A"}
                  {appointment.serviceName === null
                    ? "-" +
                      calculateEndTime(
                        appointment.appointmentTime,
                        appointment.appointmentDuration
                      )
                    : ""}
                </td>
                <td className="px-4 py-2">
                  {`${appointment.clientName ?? ""} ${
                    appointment.clientSurname ?? ""
                  }`.trim() || "Pauza"}
                </td>
                <td className="px-4 py-2">{appointment.serviceName ?? "Pauza"}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      if (appointment.appointmentId) {
                        deleteAppointment(appointment.appointmentId);
                      } else {
                        console.error("Appointment ID is undefined:", appointment);
                      }
                    }}
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs sm:text-sm"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  );
  
  
}
