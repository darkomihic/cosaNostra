import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import useAuth from '../../hooks/useAuth';
import Appointments from './Appointments';
import Availability from './Availability';
import ManageVIPStatus from './ManageVipStatus';
import BreakSchedule from './BreakSchedule';

export default function BarberDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const { auth } = useAuth();
  const decoded = auth?.token ? jwtDecode(auth.token) : undefined;
  const apiUrl = process.env.REACT_APP_API;

  useEffect(() => {
    if (decoded) {
      fetchAllAppointmentsForBarber();
    }
  }, [decoded]);

  const fetchAllAppointmentsForBarber = async () => {
    try {
      const response = await fetch(`${apiUrl}/appointment-details/${decoded.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      const sortedAppointments = data.sort(
        (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
      );
      setAppointments(sortedAppointments);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Barber Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Availability auth={auth} apiUrl={apiUrl} />
      <ManageVIPStatus auth={auth} apiUrl={apiUrl} />
      <BreakSchedule decoded={decoded} auth={auth} apiUrl={apiUrl} fetchAppointments={fetchAllAppointmentsForBarber} />
      <Appointments appointments={appointments} setAppointments={setAppointments} auth={auth} apiUrl={apiUrl} />
    </div>
  );
}
