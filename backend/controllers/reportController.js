const { getPool } = require("../config/db");

exports.dashboard = async (req, res, next) => {
  try {
    const pool = await getPool();
    const stats = await pool.request().query("SELECT * FROM vw_DashboardStats");
    const recent = await pool.request().query("SELECT TOP 5 * FROM vw_AllocationReport ORDER BY AllocationDate DESC");
    const disasters = await pool.request().query(`
      SELECT dt.TypeName, COUNT(*) AS Total
      FROM Disasters d
      INNER JOIN DisasterTypes dt ON d.DisasterTypeID = dt.DisasterTypeID
      GROUP BY dt.TypeName
    `);
    res.json({
      success: true,
      stats: stats.recordset[0],
      recentAllocations: recent.recordset,
      disasterChart: disasters.recordset
    });
  } catch (err) { next(err); }
};

exports.allocationReport = async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM vw_AllocationReport ORDER BY AllocationDate DESC");
    res.json({ success: true, data: result.recordset });
  } catch (err) { next(err); }
};

exports.activityLogs = async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT TOP 50 * FROM ActivityLogs ORDER BY CreatedAt DESC");
    res.json({ success: true, data: result.recordset });
  } catch (err) { next(err); }
};