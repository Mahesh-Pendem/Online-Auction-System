const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authenticate = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    // ✅ Check header exists
    if (!header) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // ✅ Check Bearer format
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = header.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user
    req.user = decoded; // { id, role, name }

    next();

  } catch (err) {
    console.error("Auth error:", err.message);

    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token" });
    }

    return res.status(500).json({ message: "Authentication failed" });
  }
};