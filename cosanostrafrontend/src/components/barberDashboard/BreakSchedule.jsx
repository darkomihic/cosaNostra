import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

export default function BreakSchedule({ decoded, auth, apiUrl, fetchAppointments }) {
  const [breakStart, setBreakStart] = useState(null);
  const [breakEnd, setBreakEnd] = useState(null);
  const [breakDate, setBreakDate] = useState(null);
  const [error, setError] = useState('');

  // Helper function to calculate the time difference in minutes or desired format
  const calculateTimeDifference = (start, end) => {
    const startDate = new Date(breakDate);
    const endDate = new Date(breakDate);

    // Parse hours and minutes from start and end times
    startDate.setHours(start.getHours(), start.getMinutes());
    endDate.setHours(end.getHours(), end.getMinutes());

    // Calculate difference in milliseconds and convert to minutes
    const diffMs = endDate - startDate;
    const diffMinutes = Math.floor(diffMs / 60000); // Convert ms to minutes

    return diffMinutes > 0 ? diffMinutes : 0; // Prevent negative values
  };

  const handleBreakSubmit = async () => {
    if (!breakStart || !breakEnd || !breakDate) {
      setError('Please select both start and end times for the break');
      return;
    }
    try {
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
          barberId: decoded.id,
          note: "BREAK",
        }),
      });
      if (!response.ok) throw new Error('Failed to set break');
      setError('');
      fetchAppointments();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">Schedule a Break</h3>
      <DatePicker
        selected={breakDate}
        onChange={(date) => setBreakDate(date)}
        placeholderText="Select date"
      />
      <button onClick={handleBreakSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">
        Submit Break
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
