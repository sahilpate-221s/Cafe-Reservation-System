/**
 * Role-Based Access Control (RBAC) Middleware
 * - Allows access only to specified roles
 * - Uses role injected by auth middleware
 * - Does NOT change authorization behavior
 */
exports.allowRoles = (allowedRoles = []) => {
  // Defensive: ensure allowedRoles is always an array
  if (!Array.isArray(allowedRoles)) {
    throw new Error("allowRoles expects an array of roles");
  }

  return (req, res, next) => {
    try {
      const role = req.headers["x-user-role"];

      // 1️⃣ Role must exist (auth middleware responsibility)
      if (!role) {
        console.error("🚫 RBAC ERROR: User role missing in headers");
        return res.status(401).json({
          message: "Unauthorized: role missing",
        });
      }

      // 2️⃣ Role must be allowed
      if (!allowedRoles.includes(role)) {
        console.warn("⛔ RBAC FORBIDDEN:", {
          role,
          allowedRoles,
          path: req.originalUrl,
        });

        return res.status(403).json({
          message: "Forbidden: insufficient permissions",
        });
      }

      // 3️⃣ Access granted
      console.log("✅ RBAC GRANTED:", {
        role,
        path: req.originalUrl,
      });

      next();
    } catch (err) {
      // 4️⃣ Absolute safety net
      console.error("🔥 RBAC FAILURE:", err.message);

      return res.status(500).json({
        message: "Authorization failed",
      });
    }
  };
};
