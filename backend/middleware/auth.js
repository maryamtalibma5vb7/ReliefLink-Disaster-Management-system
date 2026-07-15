const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "ReliefLinkDevSecret";
const NAME_REGEX = /^[A-Za-z][A-Za-z' \-]{2,63}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,30}$/;
const VEHICLE_REGEX = /^[A-Za-z0-9][A-Za-z0-9\- ]{2,19}$/;
const LOCATION_REGEX = /^[A-Za-z0-9][A-Za-z0-9'\-,.() ]{2,80}$/;
const DISASTER_NAME_REGEX = /^[A-Za-z0-9][A-Za-z0-9'\- ]{3,120}$/;
const DESCRIPTION_REGEX = /^.{0,500}$/;

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Authorization token is missing or invalid." });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
    req.user = decoded;
    next();
  });
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }
    if (!allowedRoles.includes(req.user.RoleName)) {
      return res.status(403).json({ success: false, message: "You do not have permission to perform this action." });
    }
    next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
  NAME_REGEX,
  EMAIL_REGEX,
  PASSWORD_REGEX,
  PHONE_REGEX,
  VEHICLE_REGEX,
  LOCATION_REGEX,
  DISASTER_NAME_REGEX,
  DESCRIPTION_REGEX
};
