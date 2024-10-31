import pool from '../models/db.js'; // Assuming you're using a MySQL database
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || '0d9f9a8d9a8df8a9df8a9d8f8adf9a8d9f8a9d8f8adf9a8df98a9d8f';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret'; // Ensure this is a strong secret
const REFRESH_TOKEN_EXPIRY = '7d'; // Set a suitable expiration time for refresh tokens




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

export function createAccessToken(user) {
  const payload = {
    id: user.id,
    userType: user.userType // 'client' or 'barber'
  };
  
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: '24h' // token expiration time
  });
}

export function createRefreshToken(user) {
  const payload = {
    id: user.id,
    userType: user.userType // 'client' or 'barber'
  };

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY // Set refresh token expiration
  });
}
