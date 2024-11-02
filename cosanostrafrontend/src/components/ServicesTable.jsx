import React, { useEffect, useState } from 'react';

export default function ServicesTable() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Accessing the API URL from the environment variable
    const apiUrl = process.env.REACT_APP_API; // Ensure you're using the correct variable

    console.log('API URL:', apiUrl); // Log the API URL being used

    fetch(`${apiUrl}/services`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setServices(data))
      .catch(error => console.error('Error fetching services:', error));
  }, []);

  if (services.length === 0) {
    return <p className="text-zinc-50">Loading services...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        {services.map((service, index) => (
          <div key={index} 
               className="bg-zinc-800 text-white p-4 sm:p-3 w-full sm:h-36 rounded-lg shadow-md flex justify-between items-center">    
            <h3 className="font-semibold xl:text-3xl lg:text-3xl md:text-xl sm:text-base mr-2">{service.serviceName}</h3>
            <p className="whitespace-nowrap xl:text-3xl lg:text-2xl md:text-lg sm:text-base">{service.servicePrice} RSD</p>
          </div>
        ))}
      </div>
    </div>
  );
}
