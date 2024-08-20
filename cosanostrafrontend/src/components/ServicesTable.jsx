import React, { useEffect, useState } from 'react';

export default function ServicesTable() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Replace this URL with your actual API endpoint
    fetch('http://localhost:8080/services')
      .then(response => response.json())
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
          <div key={index} className="bg-zinc-800 text-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold">{service.serviceName}</h3>
              <p className="text-xl">{service.servicePrice} RSD</p>
            </div>
            <button className="bg-zinc-500 hover:bg-zinc-600 text-white px-4 py-2 rounded">
              Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
