import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'saksham_jwt_super_secret_key_mo_spi_2026';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role_id,
      role_name: user.role_name,
      designation: user.designation,
      department: user.department
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or malformed Bearer token.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token.' });
  }
};

/**
 * Strict Role-Based Access Control (RBAC) middleware.
 * @param {Array<string>} allowedRoles - Array of role IDs (e.g. ['role_learner', 'role_trainer', 'role_sysadmin'])
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: Insufficient privileges. Required one of: ${allowedRoles.join(', ')}. Current: ${req.user.role}`
      });
    }

    next();
  };
};
