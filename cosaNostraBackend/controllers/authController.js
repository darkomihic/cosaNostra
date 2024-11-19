import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../models/db.js';
import {authenticateBarber, authenticateClient} from '../services/authService.js'


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

export function createTokens(user) {
  const accessToken = jwt.sign(
    { id: user.id, userType: user.userType, isVIP: user.isVIP },
    SECRET_KEY,
    { expiresIn: '15m' } // Shorter expiration for access token
  );

  const refreshToken = jwt.sign(
    { id: user.id, userType: user.userType },
    SECRET_KEY,
    { expiresIn: '7d' } // Longer expiration for refresh token
  );

  return { accessToken, refreshToken };
}


// Generate the refresh token
function createRefreshToken(user) {
  return jwt.sign(
    { id: user.id, userType: user.userType }, // Payload
    process.env.REFRESH_SECRET,              // Secret key for refresh tokens
    { expiresIn: '7d' }                      // Refresh token valid for 7 days
  );
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

  // Create tokens
  const accessToken = createToken({ id: user.clientId, userType: 'client', isVIP: user.isVIP });
  const refreshToken = createRefreshToken({ id: user.clientId, userType: 'client' });

  try {
    // Save the refresh token in the database
    await pool.query(
      `INSERT INTO refresh_tokens (token, clientId) VALUES (?, ?)`,
      [refreshToken, user.clientId]
    );

    // Set the refresh token in an HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,       // Prevents JavaScript access
      secure: true,         // Send only over HTTPS
      sameSite: 'strict',   // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });

    // Send the access token in the response body
    res.json({ accessToken });
  } catch (err) {
    console.error('Error saving refresh token:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}



export async function barberloginHandler(req, res) {
  const { barberUsername, barberPassword } = req.body;

  const user = await authenticateBarber(barberUsername, barberPassword);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // Create tokens
  const accessToken = createToken({ id: user.barberId, userType: 'barber' });
  const refreshToken = createRefreshToken({ id: user.barberId, userType: 'barber' });

  try {
    // Save the refresh token in the database
    await pool.query(
      `INSERT INTO refresh_tokens (token, clientId) VALUES (?, ?)`,
      [refreshToken, user.barberId]
    );

    // Set the refresh token in an HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,       // Prevents JavaScript access
      secure: true,         // Send only over HTTPS
      sameSite: 'strict',   // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });

    // Send the access token in the response body
    res.json({ accessToken });
  } catch (err) {
    console.error('Error saving refresh token:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
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
  const refreshToken = req.cookies.refreshToken;

  // Step 1: Check if the refresh token exists
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  try {
    // Step 2: Verify the refresh token using the refresh secret
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    // Step 3: Check if the refresh token exists in the database
    const [result] = await pool.query(
      `SELECT token, clientId FROM refresh_tokens WHERE token = ?`,
      [refreshToken]
    );

    if (result.length === 0) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }

    // Step 4: Ensure the token belongs to the correct user (optional but recommended)
    const storedRefreshToken = result[0];
    if (storedRefreshToken.clientId !== decoded.id) {
      return res.status(403).json({ message: 'Token does not belong to the correct user' });
    }

    // Step 5: Generate a new access token
    const accessToken = jwt.sign(
      { id: decoded.id, userType: decoded.userType, isVIP: decoded.isVIP },
      SECRET_KEY,
      { expiresIn: '15m' } // Access token expires in 15 minutes
    );

    // Step 6: Send the new access token in the response
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
}


export async function logoutHandler(req, res) {
  const refreshToken = req.cookies.refreshToken;

  // Remove the token from the database
  if (refreshToken) {
    await pool.query(
      `DELETE FROM refresh_tokens WHERE token = ?`,
      [refreshToken]
    );
  }

  // Clear the refresh token cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });

  res.status(204).send(); // No content
}




