import useAuth from '../../hooks/useAuth';  // Import the custom hook
import React, { useState } from 'react';

export default function BarberVipHandling({ setError }) {
  const apiUrl = process.env.REACT_APP_API;
  const { auth } = useAuth();
  const [username, setUsername] = useState('');


  const handleGiveClientVIP = async () => {
    if (!username) {
      setError('Please enter a username');
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/clientsByUsername/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
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
      const response = await fetch(`${apiUrl}/clientsByUsername/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ isVIP: 0 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update VIP status');
        console.error('Failed to update client VIP:', errorData.error);
        return;
      }
    } catch (error) {
      console.error('Error updating client VIP:', error);
    }
  }


  return (
    <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Manage Client VIP Status</h3>
        <div className="flex items-center mb-4">
          <input
            className="border p-2 mr-2 bg-neutral-700 text-white rounded-xl"
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
  )

}