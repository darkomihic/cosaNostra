import pool from '../models/db.js';
import bcrypt from 'bcryptjs';


export async function getClients() {
  const [rows] = await pool.query("SELECT * FROM client");
  return rows;
}

export async function getClient(id) {
  const [rows] = await pool.query("SELECT * FROM client WHERE clientId = ?", [id]);
  return rows[0];
}

export async function createClient(client) {
  const { clientUsername, clientPassword, clientName, clientSurname, clientPhone, isVIP } = client;
  const hashedPassword = await bcrypt.hash(clientPassword, 8);
  const [result] = await pool.query(`
    INSERT INTO client (clientUsername, clientPassword, clientName, clientSurname, clientPhone, isVIP)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [clientUsername, hashedPassword, clientName, clientSurname, clientPhone, isVIP]);
  const id = result.insertId;
  return getClient(id);
}

export async function updateClient(id, client) {
  const updates = [];
  const values = [];  
  
  for (const [key, value] of Object.entries(client)) {
    updates.push(`${key} = ?`);
    values.push(value);
  }
  
  const query = `
    UPDATE client
    SET ${updates.join(', ')}
    WHERE clientId = ?
  `;
  values.push(id);

  await pool.query(query, values);
  return getClient(id);
}

export async function updateClientByUsername(username, client) {
  const updates = [];
  const values = [];

  for (const [key, value] of Object.entries(client)) {
    // Convert boolean values to 1 or 0 for BIT type
    if (typeof value === 'boolean') {
      updates.push(`${key} = ?`);
      values.push(value ? 1 : 0);
    } else {
      updates.push(`${key} = ?`);
      values.push(value);
    }
  }

  const query = `
    UPDATE client
    SET ${updates.join(', ')}
    WHERE clientUsername = ?
  `;
  values.push(username);

  await pool.query(query, values);
}


export async function deleteClient(id) {
  const [result] = await pool.query(`DELETE FROM client WHERE clientId = ?`, [id]);
  if (result.affectedRows === 0) {
    throw new Error('No client found with this id');
  }
  return result;
}

export async function fetchClientVipStatus(id) {
  try {
    const [rows] = await pool.query(`SELECT isVIP FROM client WHERE clientId = ?`, [id]);

    if (rows.length === 0) {
      throw new Error('No client found with the provided ID');
    }

    // Convert the Buffer to boolean
    const isVIP = rows[0].isVIP.equals(Buffer.from([1])); // Assuming 1 is true

    return { isVIP }; // Return the boolean value
  } catch (error) {
    console.error('Error fetching VIP status:', error);
    throw error;
  }
}
