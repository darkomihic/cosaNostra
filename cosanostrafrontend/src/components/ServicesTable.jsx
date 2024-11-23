import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';


export default function ServicesTable() {
  const [services, setServices] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    // Accessing the API URL from the environment variable
    const apiUrl = process.env.REACT_APP_API; // Ensure you're using the correct variable

    console.log('API URL:', apiUrl); // Log the API URL being used

    // Using axios to fetch data
    axiosPrivate
      .get(`${apiUrl}/services`)
      .then((response) => {
        setServices(response.data); // Set the fetched data
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
        return <p className="text-zinc-50">Loading services...</p>;
      });
  }, []);

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
