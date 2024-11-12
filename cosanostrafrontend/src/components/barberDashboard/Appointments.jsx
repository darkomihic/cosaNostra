import React from 'react';

export default function Appointments({ appointments, setAppointments, auth, apiUrl }) {
  const deleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`${apiUrl}/appointment/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to delete appointment');
      setAppointments(appointments.filter((appointment) => appointment.appointmentId !== appointmentId));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">Appointments</h3>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.appointmentId}>
            {appointment.appointmentDate} - {appointment.appointmentTime}
            <button onClick={() => deleteAppointment(appointment.appointmentId)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
