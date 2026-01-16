const jwt = require("jsonwebtoken");

/**
 * JWT Verification Middleware
 * - Verifies Bearer token
 * - Injects user identity into headers for downstream services
 * - Does NOT change any business logic
 */
exports.verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check header presence and format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("🔐 AUTH ERROR: Missing or malformed Authorization header");
      return res.status(401).json({ message: "Token missing" });
    }

    // 2️⃣ Extract token safely
    const token = authHeader.split(" ")[1];

    if (!token) {
      console.error("🔐 AUTH ERROR: Bearer token not found after split");
      return res.status(401).json({ message: "Token missing" });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Inject identity for downstream services
    req.headers["x-user-id"] = decoded.userId || decoded.id;
    req.headers["x-user-role"] = decoded.role;

    // Optional debug (safe, non-sensitive)
    console.log("✅ JWT VERIFIED:", {
      userId: req.headers["x-user-id"],
      role: req.headers["x-user-role"],
    });

    next();
  } catch (err) {
    // 5️⃣ Handle specific JWT errors cleanly
    console.error("🔐 JWT VERIFICATION FAILED:", err.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
