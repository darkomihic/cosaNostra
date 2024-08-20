import pool from '../models/db.js';

export async function getAppointments() {
  const [rows] = await pool.query("SELECT * FROM appointment");
  return rows;
}

export async function getAppointment(id) {
  const [rows] = await pool.query("SELECT * FROM appointment WHERE appointmentId = ?", [id]);
  return rows[0];
}

export async function createAppointment(appointment) {
  const { appointmentDate, appointmentTime, note, appointmentDuration, barberId, clientId, serviceId} = appointment;
  const [result] = await pool.query(`
    INSERT INTO appointment (appointmentDate, appointmentTime, note, appointmentDuration, barberId, clientId, serviceId)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [appointmentDate, appointmentTime, note, appointmentDuration, barberId, clientId, serviceId]);
  const id = result.insertId;
  return getAppointment(id);
}

export async function updateAppointment(id, appointment) {
  const { appointmentDate, appointmentTime, note, appointmentDuration, barberId, clientId } = appointment;
  await pool.query(`
    UPDATE appointment 
    SET appointmentDate = ?, appointmentTime = ?, note = ?, appointmentDuration = ?, barberId = ?, clientId = ?
    WHERE appointmentId = ?
  `, [appointmentDate, appointmentTime, note, appointmentDuration, barberId, clientId, id]);
  return getAppointment(id);
}


export async function getAppointmentsByBarberAndDate(barberId, date) {

  const [result] = await pool.query(`SELECT * FROM appointment WHERE barberId = ? AND appointmentDate = ?`,
    [barberId, date]);
    return result;
}

export async function getAppointmentDetails(barberId) {
  const [result] = await pool.query(`
    SELECT
    A.appointmentId, 
    A.appointmentDate,
    A.appointmentTime,
    A.appointmentDuration,
    C.clientName,
    C.clientSurname,
    S.serviceName,
    S.servicePrice
FROM 
    CosaNostra.Appointment A
LEFT JOIN 
    CosaNostra.Client C ON A.clientId = C.clientId
LEFT JOIN 
    CosaNostra.Service S ON A.serviceId = S.serviceId
WHERE 
    A.barberId = ?;

  `, [barberId]);
  return result;
}

export async function getAppointmentDetailsForClient(clientId) {
  const [result] = await pool.query(`
    SELECT 
    A.appointmentDate,
    A.appointmentTime,
    B.barberName,
    B.barberSurname,
    B.barberPhone,
    S.serviceName,
    S.servicePrice
FROM 
    CosaNostra.Appointment A
JOIN 
    CosaNostra.Barber b ON A.barberId = b.barberId
JOIN 
    CosaNostra.Service S ON A.serviceId = S.serviceId
WHERE 
    A.clientId = ?;

  `, [clientId]);
  return result;
}

export async function deleteAppointment(id) {
  const [result] = await pool.query(`DELETE FROM appointment WHERE appointmentId = ?`, [id]);
  if (result.affectedRows === 0) {
    throw new Error('No appointment found with this id');
  }
  return result;
}


export async function deleteLastAppointment() {
  const[result] = await pool.query(`DELETE FROM appointment ORDER BY appointmentId DESC LIMIT 1;`);
  if (result.affectedRows === 0) {
    throw new Error('No appointments');
  }
  return result;
  
}

  