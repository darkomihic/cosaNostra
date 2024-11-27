import useAuth from '../../hooks/useAuth';  // Import the custom hook
import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode";


export default function BarberBreakHandler({ setError, fetchAllAppointmentsForBarber }) {
  const [breakStart, setBreakStart] = useState(null);
  const [breakEnd, setBreakEnd] = useState(null);
  const [breakDate, setBreakDate] = useState(null);
  const { auth } = useAuth();
  const decoded = auth?.token ? jwtDecode(auth.token) : undefined;
  const apiUrl = process.env.REACT_APP_API;

  const handleBreakSubmit = async () => {
    if (!breakStart || !breakEnd || !breakDate) {
      setError('Please select both start and end dates for the break');
      return;
    }

    
    try {
      const barberId = decoded.id;
      const response = await fetch(`${apiUrl}/appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
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
      }else {
        setBreakStart(null);
        setBreakEnd(null);
        fetchAllAppointmentsForBarber(); // Refresh appointments after setting break
      }

      
    } catch (error) {
      console.error('Error setting break:', error);
    }
  };

  function calculateTimeDifference(startTime, endTime) {
  
  
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
  
  
    return differenceInMinutes;
  };

  const timeOptions = [];
  for (let i = 9; i <= 17; i++) {
    timeOptions.push(`${i}:00`);
    timeOptions.push(`${i}:30`);
  }
  timeOptions.push('18:00');

  return (
    <>
      <h3 className="text-lg sm:text-xl font-semibold mb-4">Set Break Time</h3>
      <div className="mb-4">
        {/* Break Start Date */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
          <label className="mb-2 sm:mb-0 sm:mr-2">Break Start Date:</label>
          <input
            type="date"
            className="border p-2 bg-neutral-700 text-white rounded-xl w-full sm:w-auto"
            value={breakDate}
            onChange={(e) => setBreakDate(e.target.value)}
          />
        </div>

        {/* Break Start Time */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
          <label className="mb-2 sm:mb-0 sm:mr-2">Start:</label>
          <select
            className="border p-2 bg-neutral-700 text-white rounded-xl w-full sm:w-auto"
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
        </div>

        {/* Break End Time */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
          <label className="mb-2 sm:mb-0 sm:mr-2">End:</label>
          <select
            className="border p-2 bg-neutral-700 text-white rounded-xl w-full sm:w-auto"
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
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleBreakSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded w-full sm:w-auto"
          >
            Set Break
          </button>
        </div>
      </div>
    </>

  )
}