import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../models/db.js';
import { authenticateBarber, authenticateClient } from '../services/authService.js';
import { getClient } from '../services/clientsService.js'; // Replace with your actual service imports
import { getBarber } from '../services/barbersService.js'; // Replace with your actual service imports


const SECRET_KEY = process.env.SECRET_KEY || '0d9f9a8d9a8df8a9df8a9d8f8adf9a8d9f8a9d8f8adf9a8df98a9d8f';
const REFRESH_SECRET = process.env.REFRESH_SECRET;


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

export function createToken(user) {
  const payload = {
    id: user.id,
    userType: user.userType,  // 'client' or 'barber'
    isVIP: user.isVIP 
  };
  
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: '4h' // token expiration time
  });
}

export async function loginHandler(req, res) {
  const { clientUsername, clientPassword } = req.body;

  const user = await authenticateClient(clientUsername, clientPassword);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = createToken({ id: user.clientId, userType: 'client', isVIP: user.isVIP });
  res.json({ auth: true, token });
}

export async function barberloginHandler(req, res) {
  const { barberUsername, barberPassword } = req.body;
  // Authenticate user
  const user = await authenticateBarber(barberUsername, barberPassword);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = createToken({ id: user.barberId, userType: 'barber' });
  res.json({ auth: true, token });
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
    res.status(201).send({ id, barberUsername, barberName, barberSurname, barberPhone, available });
  } catch (error) {
    next(error);
  }
}

export async function refreshHandler(req, res) {
  try {
    const refreshToken = req.cookies?.refreshToken;

    // Check if the refresh token exists
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is missing' });
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    let user;

    // Determine user type and fetch user data
    if (decoded.userType === 'client') {
      user = await getClient(decoded.id);
    } else if (decoded.userType === 'barber') {
      user = await getBarber(decoded.id);
    } else {
      return res.status(403).json({ message: 'Invalid user type' });
    }

    // If the user is not found
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    // Generate new tokens
    const newAccessToken = jwt.sign(
      {
        id: user.id,
        userType: decoded.userType,
        ...(decoded.userType === 'client' && { isVIP: user.isVIP }) // Include isVIP if the user is a client
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
      { id: user.id, userType: decoded.userType },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Send the new tokens
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
}