import useAuth from '../../hooks/useAuth';  // Import the custom hook
import { jwtDecode } from "jwt-decode";


export default function BarberAvaialability() {
  const apiUrl = process.env.REACT_APP_API;
  const { auth } = useAuth();
  const decoded = auth?.token ? jwtDecode(auth.token) : undefined;


  const handleAvailabilityChange = async (availability) => {
    try {
      const barberId = decoded.id;
      const response = await fetch(`${apiUrl}/barbers/${barberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
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
  )
}