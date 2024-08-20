import { getAppointmentsByBarberAndDate,getAppointmentDetails, getAppointments, getAppointment, createAppointment, updateAppointment, deleteAppointment, deleteLastAppointment, getAppointmentDetailsForClient } from '../services/appointmentsService.js';
import { getService } from '../services/servicesService.js';

export async function getAppointmentsHandler(req, res, next) {
  try {
    const appointments = await getAppointments();
    res.send(appointments);
  } catch (error) {
    next(error);
  }
}

export async function GetAvailableSlotsHandler(req, res, next) {
  const { barberId, serviceId, date } = req.query;

  if (!barberId || !serviceId || !date) {
    return res.status(400).json({ error: 'barberId, serviceId, and date are required' });
  }

  try {
    const service = await getService(serviceId);
    const serviceDuration = service.serviceDuration;
    const appointments = await getAppointmentsByBarberAndDate(barberId, date);
    const availableSlots = calculateAvailableSlots(appointments, serviceDuration, date);
    res.json(availableSlots);
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ error: 'Failed to fetch available slots' });
  }
}

function calculateAvailableSlots(appointments, serviceDuration, selectedDate) {
  const workingHours = { start: 9, end: 18 }; // Assuming working hours from 9 AM to 6 PM
  const interval = 30; // Interval in minutes
  const availableSlots = [];
  const selectedDateObj = new Date(selectedDate);
  
  // Ensure the selectedDateObj is set to the start of the day in local time
  selectedDateObj.setHours(0, 0, 0, 0);

  for (let hour = workingHours.start; hour < workingHours.end; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const slotStart = new Date(selectedDateObj.getTime());
      slotStart.setHours(hour, minute, 0, 0);
      const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60000);


      const isAvailable = appointments.every(appointment => {
        // Parse appointmentDate and appointmentTime to construct the full Date objects
        const appointmentStart = new Date(appointment.appointmentDate);
        const [hours, minutes, seconds] = appointment.appointmentTime.split(':');
        appointmentStart.setHours(hours, minutes, seconds, 0);
        const appointmentEnd = new Date(appointmentStart.getTime() + appointment.appointmentDuration * 60000);

        return slotEnd <= appointmentStart || slotStart >= appointmentEnd;
      });

      if (isAvailable) {
        availableSlots.push({ start: slotStart.toISOString(), end: slotEnd.toISOString() });
      }
    }
  }

  return availableSlots;
}


export async function getAppointmentHandler(req, res, next) {
  try {
    const id = req.params.id;
    const appointment = await getAppointment(id);
    res.send(appointment);
  } catch (error) {
    next(error);
  }
}

export async function createAppointmentHandler(req, res, next) {
  try {
    const appointment = await createAppointment(req.body);
    res.status(201).send(appointment);
  } catch (error) {
    next(error);
  }
}

export async function updateAppointmentHandler(req, res, next) {
  try {
    const id = req.params.id;
    const appointment = await updateAppointment(id, req.body);
    res.status(200).send(appointment);
  } catch (error) {
    next(error);
  }
}

export async function deleteAppointmentHandler(req, res, next) {
  try {
    const id = req.params.id;
    await deleteAppointment(id);
    res.status(200).send({ message: `Deleted appointment with id: ${id}` });
  } catch (error) {
    next(error);
  }
}

export async function deleteLastAppointmentHandler(req, res, next) {
  try {
    await deleteLastAppointment();
    res.status(200).send({ message: `Deleted last appointment `});
  } catch(error) {
    next(error);
  }
}



export async function getAppointmentDetailsHandler(req, res, next) {
  try {
    const barberId = req.params.id; // Assuming id in the URL represents barberId
    const appointment = await getAppointmentDetails(barberId);
    res.send(appointment);
  } catch (error) {
    next(error);
  }
}

export async function getAppointmentDetailsForClientHandler(req, res, next) {
  try {
    const clientId = req.params.id;
    const appointment = await getAppointmentDetailsForClient(clientId);
    res.send(appointment);
  } catch(error) {
    next(error);
  }
}

