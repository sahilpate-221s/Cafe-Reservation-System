/**
 * Role-Based Access Control middleware
 * @param {Array} allowedRoles - roles allowed to access route
 */
exports.allowRoles = (allowedRoles = []) => {
  return (req, res, next) => {
    const role = req.headers["x-user-role"];

    if (!role) {
      return res.status(401).json({
        message: "Unauthorized: role missing",
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        message: "Forbidden: insufficient permissions",
      });
    }

    next();
  };
};
