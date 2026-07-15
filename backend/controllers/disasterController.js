const { sql, getPool } = require("../config/db");
const { DISASTER_NAME_REGEX, LOCATION_REGEX, DESCRIPTION_REGEX } = require("../middleware/auth");

exports.getTypes = async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM DisasterTypes ORDER BY TypeName");
    res.json({ success: true, data: result.recordset });
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT d.*, dt.TypeName,
             dbo.fn_DisasterUrgencyScore(d.Severity, d.AffectedPeople) AS UrgencyScore
      FROM Disasters d
      INNER JOIN DisasterTypes dt ON d.DisasterTypeID = dt.DisasterTypeID
      ORDER BY d.CreatedAt DESC
    `);
    res.json({ success: true, data: result.recordset });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("DisasterID", sql.Int, req.params.id)
      .query("SELECT * FROM Disasters WHERE DisasterID=@DisasterID");
    res.json({ success: true, data: result.recordset[0] });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { DisasterTypeID, DisasterName, LocationName, Severity, AffectedPeople, DisasterDate, Status, Description } = req.body;
    if (!DisasterTypeID || !DisasterName || !LocationName || AffectedPeople == null || AffectedPeople < 0) {
      return res.status(400).json({ success: false, message: "Disaster type, name, location and valid affected people count are required." });
    }
    if (!DISASTER_NAME_REGEX.test(DisasterName.trim())) {
      return res.status(400).json({ success: false, message: "Disaster name must be 4-120 characters and contain only letters, numbers, spaces, apostrophes and hyphens." });
    }
    if (!LOCATION_REGEX.test(LocationName.trim())) {
      return res.status(400).json({ success: false, message: "Location name must be 3-80 characters and contain only letters, numbers and punctuation." });
    }
    if (Description && !DESCRIPTION_REGEX.test(Description.trim())) {
      return res.status(400).json({ success: false, message: "Description must be under 500 characters." });
    }
    const pool = await getPool();
    await pool.request()
      .input("DisasterTypeID", sql.Int, DisasterTypeID)
      .input("DisasterName", sql.NVarChar, DisasterName)
      .input("LocationName", sql.NVarChar, LocationName)
      .input("Severity", sql.NVarChar, Severity)
      .input("AffectedPeople", sql.Int, AffectedPeople)
      .input("DisasterDate", sql.Date, DisasterDate)
      .input("Status", sql.NVarChar, Status || "Active")
      .input("Description", sql.NVarChar, Description || "")
      .query(`INSERT INTO Disasters(DisasterTypeID,DisasterName,LocationName,Severity,AffectedPeople,DisasterDate,Status,Description)
              VALUES(@DisasterTypeID,@DisasterName,@LocationName,@Severity,@AffectedPeople,@DisasterDate,@Status,@Description)`);
    res.json({ success: true, message: "Disaster created successfully." });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { DisasterTypeID, DisasterName, LocationName, Severity, AffectedPeople, DisasterDate, Status, Description } = req.body;
    if (!DisasterTypeID || !DisasterName || !LocationName || AffectedPeople == null || AffectedPeople < 0) {
      return res.status(400).json({ success: false, message: "Disaster type, name, location and valid affected people count are required." });
    }
    if (!DISASTER_NAME_REGEX.test(DisasterName.trim())) {
      return res.status(400).json({ success: false, message: "Disaster name must be 4-120 characters and contain only letters, numbers, spaces, apostrophes and hyphens." });
    }
    if (!LOCATION_REGEX.test(LocationName.trim())) {
      return res.status(400).json({ success: false, message: "Location name must be 3-80 characters and contain only letters, numbers and punctuation." });
    }
    if (Description && !DESCRIPTION_REGEX.test(Description.trim())) {
      return res.status(400).json({ success: false, message: "Description must be under 500 characters." });
    }
    const pool = await getPool();
    await pool.request()
      .input("DisasterID", sql.Int, req.params.id)
      .input("DisasterTypeID", sql.Int, DisasterTypeID)
      .input("DisasterName", sql.NVarChar, DisasterName)
      .input("LocationName", sql.NVarChar, LocationName)
      .input("Severity", sql.NVarChar, Severity)
      .input("AffectedPeople", sql.Int, AffectedPeople)
      .input("DisasterDate", sql.Date, DisasterDate)
      .input("Status", sql.NVarChar, Status)
      .input("Description", sql.NVarChar, Description || "")
      .query(`UPDATE Disasters SET DisasterTypeID=@DisasterTypeID, DisasterName=@DisasterName, LocationName=@LocationName,
              Severity=@Severity, AffectedPeople=@AffectedPeople, DisasterDate=@DisasterDate, Status=@Status, Description=@Description
              WHERE DisasterID=@DisasterID`);
    res.json({ success: true, message: "Disaster updated successfully." });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const pool = await getPool();
    await pool.request()
      .input("DisasterID", sql.Int, req.params.id)
      .query("DELETE FROM Disasters WHERE DisasterID=@DisasterID");
    res.json({ success: true, message: "Disaster deleted successfully." });
  } catch (err) { next(err); }
};