function permit(...allowed) {
  return (req, res, next) => {
    const { user } = req;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if (allowed.includes(user.role) || user.role === 'admin') return next();
    return res.status(403).json({ message: 'Forbidden' });
  };
}

module.exports = { permit };
