const jwt = require("jsonwebtoken");

/**
 * VERIFY JWT TOKEN
 * - Validates Bearer token
 * - Attaches decoded payload to req.user
 * - No behavior change
 */
exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Validate header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token missing" });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Validate payload integrity
    if (!decoded?.userId || !decoded?.role) {
      return res
        .status(401)
        .json({ message: "Invalid token payload" });
    }

    // 4️⃣ Attach user context
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    // Covers expired token, invalid signature, malformed token
    return res
      .status(401)
      .json({ message: "Invalid or expired token" });
  }
};

/**
 * REQUIRE ADMIN ROLE
 * - Assumes verifyToken already ran
 */
exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};
