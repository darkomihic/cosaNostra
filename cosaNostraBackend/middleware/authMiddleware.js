import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || '0d9f9a8d9a8df8a9df8a9d8f8adf9a8d9f8a9d8f8adf9a8df98a9d8f';

// Middleware to verify JWT token
export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Check if the Authorization header is present and well-formed
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ auth: false, message: 'No token provided or invalid format' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ auth: false, message: 'Failed to authenticate token' });
    }

    // If token is valid, attach decoded data to the request
    req.userId = decoded.id;
    req.userType = decoded.userType;

    next();
  });
}
