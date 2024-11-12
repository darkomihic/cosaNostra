import React from 'react';

export default function Availability({ auth, apiUrl }) {
  const handleAvailabilityChange = async (availability) => {
    try {
      const response = await fetch(`${apiUrl}/barbers/${auth.token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ available: availability }),
      });
      if (!response.ok) throw new Error('Failed to update availability');
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  return (
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
  );
}
