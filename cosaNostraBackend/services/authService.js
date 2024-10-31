import pool from '../models/db.js'; // Assuming you're using a MySQL database
import bcrypt from 'bcrypt';


export async function authenticateClient(username, password) {
  const [rows] = await pool.query('SELECT * FROM client WHERE clientUsername = ?', [username]);
  const client = rows[0];

  if (!client) {
    console.log(`No client found with username: ${username}`);
    return null;
  }

  const passwordMatch = await bcrypt.compare(password, client.clientPassword);
  if (!passwordMatch) {
    console.log(`Password does not match for username: ${username}`);
    return null;
  }
  
  return client;
}

export async function authenticateBarber(username, password) {
  const [rows] = await pool.query('SELECT * FROM barber WHERE barberUsername = ?', [username]);
  const barber = rows[0];

  if (!barber) {
    console.log(`No barber found with username: ${username}`);
    return null;
  }

  const passwordMatch = await bcrypt.compare(password, barber.barberPassword);
  if (!passwordMatch) {
    console.log(`Password does not match for username: ${username}`);
    return null;
  }
  return barber;
}
