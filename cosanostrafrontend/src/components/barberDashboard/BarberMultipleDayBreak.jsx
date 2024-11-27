import { jwtDecode } from "jwt-decode";
import useAuth from '../../hooks/useAuth';  // Import the custom hook
import React, { useState } from 'react';

export default function BarberMultipleDayBreak({ setError, fetchAllAppointmentsForBarber }) {
  
  const [startBreakDate, setStartBreakDate] = useState(null);
  const [endBreakDate, setEndBreakDate] = useState(null);
  const { auth } = useAuth();
  const decoded = auth?.token ? jwtDecode(auth.token) : undefined;
  const apiUrl = process.env.REACT_APP_API;

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

  const iterateDaysInRange = (start, end, callback) => {
    const startDate = new Date(start);
    const endDate = new Date(end);


    const date = new Date(startDate);
    while (date <= endDate) {
        callback(new Date(date));
        date.setDate(date.getDate() + 1);
    }
};

const handleMultipleDayBreakSubmit = async () => {
    if (!startBreakDate || !endBreakDate) {
        setError('Please select start and end dates for the break');
        return;
    }


    try {
        const barberId = decoded.id;

        iterateDaysInRange(startBreakDate, endBreakDate, async (date) => {

            const response = await fetch(`${apiUrl}/appointment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`,
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

        });

        setStartBreakDate(null);
        setEndBreakDate(null);
        fetchAllAppointmentsForBarber();

    } catch (error) {
        console.error('Error setting break:', error);
    }
};

return (
    <div className="mb-4">
      <h3 className="text-lg sm:text-xl font-semibold mb-4">Set Multiple Day Break</h3>

      {/* Break Start Date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
        <label className="mb-2 sm:mb-0 sm:mr-2">Break Start Date:</label>
        <input
          type="date"
          className="border p-2 bg-neutral-700 text-white rounded-xl w-full sm:w-auto"
          value={startBreakDate}
          onChange={(e) => setStartBreakDate(e.target.value)}
        />
      </div>

      {/* Break End Date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
        <label className="mb-2 sm:mb-0 sm:mr-2">Break End Date:</label>
        <input
          type="date"
          className="border p-2 bg-neutral-700 text-white rounded-xl w-full sm:w-auto"
          value={endBreakDate}
          onChange={(e) => setEndBreakDate(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleMultipleDayBreakSubmit}
          className="py-2 my-4 bg-zinc-200 hover:bg-neutral-800 text-black hover:text-white rounded-xl font-bold mx-auto"
        >
          Set Multiple Day Break
        </button>
      </div>
    </div>

)
}