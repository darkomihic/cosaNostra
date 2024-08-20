import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function BarberDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [breakStart, setBreakStart] = useState(null);
  const [breakEnd, setBreakEnd] = useState(null);
  const [breakDate, setBreakDate] = useState(null);
  const [startBreakDate, setStartBreakDate] = useState(null);
  const [endBreakDate, setEndBreakDate] = useState(null);


  useEffect(() => {
    fetchAllAppointmentsForBarber();
  }, []);

  const fetchAllAppointmentsForBarber = async () => {
    try {
      const barberId = localStorage.barberId;
      const response = await fetch(`http://localhost:8080/appointment-details/${barberId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.barberToken}`,
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

  const handleAvailabilityChange = async (availability) => {
    try {
      const barberId = localStorage.barberId;
      const response = await fetch(`http://localhost:8080/barbers/${barberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.barberToken}`,
        },
        body: JSON.stringify({ available: availability }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update availability:', errorData.error);
        return;
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const handleGiveClientVIP = async () => {
    if (!username) {
      setError('Please enter a username');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/clientsByUsername/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.barberToken}`,
        },
        body: JSON.stringify({ isVIP: 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update client VIP:', errorData.error);
        return;
      }
    } catch (error) {
      console.error('Error updating client VIP:', error);
    }
  }

  const handleRevokeClientVIP = async () => {
    if (!username) {
      setError('Please enter a username');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/clientsByUsername/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.barberToken}`,
        },
        body: JSON.stringify({ isVIP: 0 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update client VIP:', errorData.error);
        return;
      }
    } catch (error) {
      console.error('Error updating client VIP:', error);
    }
  }

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

  function calculateTimeDifference(startTime, endTime) {
    console.log(`Start Time: ${startTime}, End Time: ${endTime}`);
  
    // Check if the time strings are in the correct format
    if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
      throw new Error('Invalid time format. Expected format HH:MM.');
    }
  
    // Parse the start and end times
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
  
    // Ensure hours and minutes are valid numbers
    if (isNaN(startHours) || isNaN(startMinutes) || isNaN(endHours) || isNaN(endMinutes)) {
      throw new Error('Invalid time value.');
    }
  
    // Convert the start and end times to minutes
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
  
    // Calculate the difference in minutes
    const differenceInMinutes = endTotalMinutes - startTotalMinutes;
  
    console.log(`Difference in Minutes: ${differenceInMinutes}`);
  
    return differenceInMinutes;
  };

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

  const handleBreakSubmit = async () => {
    if (!breakStart || !breakEnd || !breakDate) {
      setError('Please select both start and end dates for the break');
      return;
    }
    
    try {
      const barberId = localStorage.barberId;
      const response = await fetch(`http://localhost:8080/appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.barberToken}`,
        },
        body: JSON.stringify({
          appointmentDate: breakDate,
          appointmentTime: breakStart,
          appointmentDuration: calculateTimeDifference(breakStart, breakEnd),
          barberId: barberId,
          note:"BREAK"
           }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to set break:', errorData.error);
        return;
      }

      setBreakStart(null);
      setBreakEnd(null);
      fetchAllAppointmentsForBarber(); // Refresh appointments after setting break
    } catch (error) {
      console.error('Error setting break:', error);
    }
  };

  const iterateDaysInRange = (start, end, callback) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    console.log("Iterating from:", startDate.toDateString(), "to:", endDate.toDateString());

    const date = new Date(startDate);
    while (date <= endDate) {
        console.log('Current Date:', date.toDateString());
        callback(new Date(date));
        date.setDate(date.getDate() + 1);
    }
};

const handleMultipleDayBreakSubmit = async () => {
    if (!startBreakDate || !endBreakDate) {
        setError('Please select start and end dates for the break');
        console.log('Missing date(s):', startBreakDate, endBreakDate);
        return;
    }

    console.log('Start Date:', startBreakDate, 'End Date:', endBreakDate);

    try {
        const barberId = localStorage.barberId;

        iterateDaysInRange(startBreakDate, endBreakDate, async (date) => {
            console.log("usao");

            const response = await fetch(`http://localhost:8080/appointment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.barberToken}`,
                },
                body: JSON.stringify({
                    appointmentDate: date.toISOString().split('T')[0],
                    appointmentTime: "09:00", // Ensure time is in HH:MM format
                    appointmentDuration: calculateTimeDifference("09:00", "18:00"),
                    barberId: barberId,
                    note: 'BREAK',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Failed to set break for ${date}:`, errorData.error);
                return;
            }

            console.log(`Break set for ${date}`);
        });

        setBreakStart(null);
        setBreakEnd(null);
        setStartBreakDate(null);
        setEndBreakDate(null);
        fetchAllAppointmentsForBarber();

    } catch (error) {
        console.error('Error setting break:', error);
    }
};


  const deleteAppointment = async (appointmentId) => {
    if (!appointmentId) {
      console.error('Invalid appointmentId:', appointmentId);
      setError('Invalid appointment ID');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/appointment/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.barberToken}`,
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
  
  

  const timeOptions = [];
  for (let i = 9; i <= 17; i++) {
    timeOptions.push(`${i}:00`);
    timeOptions.push(`${i}:30`);
  }
  timeOptions.push('18:00');
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Barber Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Set Availability</h3>
        <div className="flex space-x-4 mb-4">
          <button onClick={() => handleAvailabilityChange("None")} className="px-4 py-2 bg-blue-500 text-white rounded">
            Available to None
          </button>
          <button onClick={() => handleAvailabilityChange("All")} className="px-4 py-2 bg-blue-500 text-white rounded">
            Available to All
          </button>
          <button onClick={() => handleAvailabilityChange("VIPs")} className="px-4 py-2 bg-blue-500 text-white rounded">
            Available to VIPs
          </button>
        </div>
      </div>
  
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Manage Client VIP Status</h3>
        <div className="flex items-center mb-4">
          <input
            className="border p-2 mr-2 bg-neutral-700 text-white"
            type="text"
            placeholder="Client username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleGiveClientVIP} className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
            Give VIP
          </button>
          <button onClick={handleRevokeClientVIP} className="px-4 py-2 bg-blue-500 text-white rounded">
            Revoke VIP
          </button>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Set Break Time</h3>
        <div className="mb-4">
          <label className="mr-2">Break Start Date:</label>
          <input
            type="date"
            className="border p-2 bg-neutral-700 text-white mr-4"
            value={breakDate}
            onChange={(e) => setBreakDate(e.target.value)}
          />
          <label className="mr-2">Start:</label>
          <select
            className="border p-2 bg-neutral-700 text-white mr-4"
            value={breakStart}
            onChange={(e) => setBreakStart(e.target.value)}
          >
            <option value="">Select start time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
  
          <label className="mr-2">End:</label>
          <select
            className="border p-2 bg-neutral-700 text-white"
            value={breakEnd}
            onChange={(e) => setBreakEnd(e.target.value)}
          >
            <option value="">Select end time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
  
          <button onClick={handleBreakSubmit} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded">
            Set Break
          </button>
        </div>
        <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Set Multiple Day Break</h3>
          <label className="mr-2">Break Start Date:</label>
          <input
            type="date"
            className="border p-2 bg-neutral-700 text-white mr-4"
            value={startBreakDate}
            onChange={(e) => setStartBreakDate(e.target.value)}
          />
          <label className="mr-2">Break End Date:</label>
          <input
            type="date"
            className="border p-2 bg-neutral-700 text-white mr-4"
            value={endBreakDate}
            onChange={(e) => setEndBreakDate(e.target.value)}
          />
          <button onClick={handleMultipleDayBreakSubmit} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded">
            Set Multiple Day Break
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Appointments</h3>
        <div className="overflow-auto border rounded-md">
          <table className="min-w-full">
            <thead>
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
                <tr key={appointment.appointmentId}>
                  <td className="px-4 py-2">{appointment.appointmentDate ? formatDate(appointment.appointmentDate) : 'N/A'}</td>
                  <td className="px-4 py-2">{appointment.appointmentTime ? convertTime(appointment.appointmentTime) : 'N/A'}
                    {appointment.serviceName === null ? "-" + calculateEndTime(appointment.appointmentTime, appointment.appointmentDuration) : ''}
                  </td>
                  <td className="px-4 py-2">{`${appointment.clientName ?? ''} ${appointment.clientSurname ?? ''}`.trim() || 'Pauza'}</td>
                  <td className="px-4 py-2">{appointment.serviceName ?? 'Pauza'}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => {
                        console.log('Deleting appointment with ID:', appointment.appointmentId);
                        if (appointment.appointmentId) {
                          deleteAppointment(appointment.appointmentId);
                        } else {
                          console.error('Appointment ID is undefined:', appointment);
                        }
                      }}
                      className="px-2 py-1 bg-red-500 text-white rounded"
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
