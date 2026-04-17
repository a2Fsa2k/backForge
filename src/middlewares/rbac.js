/**
 * NEW: Role-based access control middleware.
 * Safe: isolated middleware; controllers remain unchanged.
 */
function requireRole(...roles) {
  return (req, res, next) => {
    const role = req.userRole || 'user';
    if (!roles.includes(role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    return next();
  };
}

module.exports = { requireRole };
