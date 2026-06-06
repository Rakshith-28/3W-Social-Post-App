const jwt = require('jsonwebtoken');

// Protect routes by verifying the JWT in the Authorization header.
// Expected header format: "Authorization: Bearer <token>"
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded payload (id, username) to the request
    req.user = {
      id: decoded.id,
      username: decoded.username,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = auth;
