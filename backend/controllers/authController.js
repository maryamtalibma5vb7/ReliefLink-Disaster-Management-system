const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql, getPool } = require("../config/db");
const { NAME_REGEX, EMAIL_REGEX, PASSWORD_REGEX } = require("../middleware/auth");

const ALLOWED_ROLES = ["Admin", "Operator", "Viewer"];

function createToken(user) {
  return jwt.sign(
    { UserID: user.UserID, FullName: user.FullName, Email: user.Email, RoleName: user.RoleName },
    process.env.JWT_SECRET || "ReliefLinkDevSecret",
    { expiresIn: "8h" }
  );
}

exports.signup = async (req, res, next) => {
  try {
    const { fullName, email, password, roleName } = req.body;
    const cleanRole = ALLOWED_ROLES.includes(roleName) ? roleName : "Operator";

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "Full name, email and password are required." });
    }
    if (!NAME_REGEX.test(fullName.trim())) {
      return res.status(400).json({ success: false, message: "Full name must be 3-64 characters and contain only letters, spaces, apostrophes, or hyphens." });
    }
    if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character." });
    }

    const pool = await getPool();
    const existing = await pool.request()
      .input("Email", sql.NVarChar, email.trim().toLowerCase())
      .query("SELECT UserID FROM Users WHERE Email=@Email");

    if (existing.recordset.length) {
      return res.status(409).json({ success: false, message: "Email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await pool.request()
      .input("FullName", sql.NVarChar, fullName.trim())
      .input("Email", sql.NVarChar, email.trim().toLowerCase())
      .input("PasswordHash", sql.NVarChar, passwordHash)
      .input("RoleName", sql.NVarChar, cleanRole)
      .query("INSERT INTO Users(FullName, Email, PasswordHash, RoleName) VALUES(@FullName,@Email,@PasswordHash,@RoleName)");

    res.json({ success: true, message: `${cleanRole} account created successfully. Please login.` });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const pool = await getPool();
    const result = await pool.request()
      .input("Email", sql.NVarChar, email.trim().toLowerCase())
      .query("SELECT UserID, FullName, Email, PasswordHash, RoleName FROM Users WHERE Email=@Email");

    const user = result.recordset[0];
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password." });

    const valid = user.PasswordHash?.startsWith("$2")
      ? await bcrypt.compare(password, user.PasswordHash)
      : password === user.PasswordHash;

    if (!valid) return res.status(401).json({ success: false, message: "Invalid email or password." });

    if (!user.PasswordHash?.startsWith("$2")) {
      const upgradedHash = await bcrypt.hash(password, 12);
      await pool.request()
        .input("Email", sql.NVarChar, user.Email)
        .input("PasswordHash", sql.NVarChar, upgradedHash)
        .query("UPDATE Users SET PasswordHash=@PasswordHash WHERE Email=@Email");
    }

    const safeUser = { UserID: user.UserID, FullName: user.FullName, Email: user.Email, RoleName: user.RoleName };
    res.json({ success: true, user: safeUser, token: createToken(safeUser) });
  } catch (err) { next(err); }
};
