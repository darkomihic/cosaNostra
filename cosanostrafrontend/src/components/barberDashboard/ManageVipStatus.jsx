import React, { useState } from 'react';

export default function ManageVIPStatus({ auth, apiUrl }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleVIPStatusChange = async (isVIP) => {
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
        body: JSON.stringify({ isVIP }),
      });
      if (!response.ok) throw new Error('Failed to update client VIP status');
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">Manage Client VIP Status</h3>
      <input
        className="border p-2 mr-2 bg-neutral-700 text-white"
        type="text"
        placeholder="Client username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={() => handleVIPStatusChange(1)} className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
        Give VIP
      </button>
      <button onClick={() => handleVIPStatusChange(0)} className="px-4 py-2 bg-blue-500 text-white rounded">
        Revoke VIP
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
