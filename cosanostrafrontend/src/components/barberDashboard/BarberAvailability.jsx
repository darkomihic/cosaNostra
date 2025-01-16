import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';  // Import the custom hook
import { jwtDecode } from "jwt-decode";


export default function BarberAvaialability() {
  const apiUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_API_LOCAL // Use local API in development
    : process.env.REACT_APP_API;      // Use production API in production
  const { auth } = useAuth();
  const decoded = auth?.token ? jwtDecode(auth.token) : undefined;
  const [notification, setNotification] = useState(""); // State for the notification message


  const handleAvailabilityChange = async (availability) => {
    try {
      const barberId = decoded.id;
      const response = await fetch(`${apiUrl}/barbers/${barberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ available: availability }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update availability:", errorData.error);
        setNotification("Došlo je do greške prilikom promene dostupnosti."); // Error message
        return;
      }
  
      // Determine the success message based on availability
      let message = "";
      if (availability === "All") {
        message = "Trenutno si dostupan svima!";
      } else if (availability === "VIPs") {
        message = "Trenutno si dostupan samo VIP korisnicima!";
      } else if (availability === "None") {
        message = "Trenutno si nedostupan!";
      }
  
      setNotification(message);
  
      // Hide the notification after 3 seconds
      setTimeout(() => setNotification(""), 10000);
    } catch (error) {
      console.error("Error updating availability:", error);
      setNotification("Došlo je do greške prilikom promene dostupnosti."); // Error message
    }
  };

  return (
    <div className="mb-6">
    <h3 className="text-xl font-semibold mb-2">Set Availability</h3>
    {notification && (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-zinc-200 text-black px-4 py-2 rounded-xl shadow-md z-50">
      {notification}
    </div>
)}
    <div className="flex space-x-4 mb-4">
      <button onClick={() => handleAvailabilityChange("None")} className="p-2 my-4 bg-zinc-200 hover:bg-neutral-800 text-black hover:text-white rounded-xl font-bold mx-auto">
        Available to None
      </button>
      <button onClick={() => handleAvailabilityChange("All")} className="p-2 my-4 bg-zinc-200 hover:bg-neutral-800 text-black hover:text-white rounded-xl font-bold mx-auto">
        Available to All
      </button>
      <button onClick={() => handleAvailabilityChange("VIPs")} className="p-2 my-4 bg-zinc-200 hover:bg-neutral-800 text-black hover:text-white rounded-xl font-bold mx-auto">
        Available to VIPs
      </button>
    </div>
  </div>
  )
}