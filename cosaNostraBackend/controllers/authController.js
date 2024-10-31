import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../models/db.js';
import {authenticateBarber, authenticateClient, createAccessToken, createRefreshToken} from '../services/authService.js'

const SECRET_KEY = process.env.SECRET_KEY || '0d9f9a8d9a8df8a9df8a9d8f8adf9a8d9f8a9d8f8adf9a8df98a9d8f';


export function createToken(user) {
  const payload = {
    id: user.id,
    userType: user.userType // 'client' or 'barber'
  };
  
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: '24h' // token expiration time
  });
}


export async function registerHandler(req, res, next) {
  try {
    const { clientUsername, clientPassword, clientName, clientSurname, clientPhone, clientEmail, isVIP } = req.body;

    // Check if the username already exists
    const [existingUser] = await pool.query(`
      SELECT clientUsername FROM client WHERE clientUsername = ?
    `, [clientUsername]);

    if (existingUser.length > 0) {
      return res.status(400).send({ error: 'Username already taken' });
    }

    // Hash the password and insert the new client
    const hashedPassword = await bcrypt.hash(clientPassword, 8);
    const [result] = await pool.query(`
      INSERT INTO client (clientUsername, clientPassword, clientName, clientSurname, clientPhone, clientEmail, isVIP)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `, [clientUsername, hashedPassword, clientName, clientSurname, clientPhone, clientEmail, isVIP]);

    const id = result.insertId;
    res.status(201).send({ id, clientUsername, clientName, clientSurname, clientPhone, isVIP });
  } catch (error) {
    next(error);
  }
}


export async function loginHandler(req, res) {
  const { clientUsername, clientPassword } = req.body;
  const user = await authenticateClient(clientUsername, clientPassword);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = createAccessToken({ id: user.clientId, userType: 'client' });
  const refreshToken = createRefreshToken({ id: user.clientId, userType: 'client' });

  // Store the refresh token in the database
  await pool.query(`INSERT INTO refresh_tokens (clientId, refreshToken) VALUES (?, ?)`, [user.clientId, refreshToken]);

  // Set HttpOnly cookies for tokens
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set secure flag in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({ auth: true, clientId: user.clientId, isVIP: user.isVIP });
}

export async function barberloginHandler(req, res) {
  const { barberUsername, barberPassword } = req.body;
  const user = await authenticateBarber(barberUsername, barberPassword);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = createAccessToken({ id: user.barberId, userType: 'barber' });
  const refreshToken = createRefreshToken({ id: user.barberId, userType: 'barber' });

  // Store the refresh token in the database
  await pool.query(`INSERT INTO refresh_tokens (barberId, refreshToken) VALUES (?, ?)`, [user.barberId, refreshToken]);

  // Set HttpOnly cookies for tokens
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({ auth: true, barberId: user.barberId });
}


export async function barberregisterHandler(req, res, next) {
  try {
    const { barberUsername, barberPassword, barberName, barberSurname, barberPhone, available } = req.body;

    // Check if the username already exists
    const [existingBarber] = await pool.query(`
      SELECT barberUsername FROM barber WHERE barberUsername = ?
    `, [barberUsername]);

    if (existingBarber.length > 0) {
      return res.status(400).send({ error: 'Username already taken' });
    }

    // Hash the password and insert the new barber
    const hashedPassword = await bcrypt.hash(barberPassword, 8);
    const [result] = await pool.query(`
      INSERT INTO barber (barberUsername, barberPassword, barberName, barberSurname, barberPhone, available)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [barberUsername, hashedPassword, barberName, barberSurname, barberPhone, available]);

    const id = result.insertId;
    res.status(201).send({ id, barberUsername, hashedPassword, barberName, barberSurname, barberPhone, available });
  } catch (error) {
    next(error);
  }
}

export async function refreshTokenHandler(req, res) {
  const refreshToken = req.cookies.refreshToken; // Get the refresh token from the cookies
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token is required' });

  // Verify the refresh token
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    
    // Optional: Check if the refresh token is in your database
    const [storedToken] = await pool.query(`SELECT * FROM refresh_tokens WHERE refreshToken = ?`, [refreshToken]);
    if (storedToken.length === 0) return res.status(403).json({ message: 'Refresh token is invalid' });

    // Generate a new access token
    const accessToken = createAccessToken({ id: decoded.id, userType: decoded.userType });
    
    // Set the new access token cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({ accessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
}


export async function logoutHandler(req, res) {
  const { refreshToken } = req.body; // Client sends the refresh token to be removed
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token is required' });

  // Remove the refresh token from the database
  await pool.query(`DELETE FROM refresh_tokens WHERE refreshToken = ?`, [refreshToken]);

  res.json({ message: 'Logged out successfully' });
}



