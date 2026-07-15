const { sql, getPool } = require("../config/db");

exports.getAll = async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM vw_AllocationReport ORDER BY AllocationDate DESC");
    res.json({ success: true, data: result.recordset });
  } catch (err) { next(err); }
};

exports.allocate = async (req, res, next) => {
  try {
    const {
      DisasterID,
      AmbulanceID,
      FoodID,
      FoodQuantity,
      ShelterID,
      ShelterPeople,
      PriorityLevel,
      AllocatedBy,
      Notes
    } = req.body;

    const pool = await getPool();
    const result = await pool.request()
      .input("DisasterID", sql.Int, DisasterID)
      .input("AmbulanceID", sql.Int, AmbulanceID || null)
      .input("FoodID", sql.Int, FoodID || null)
      .input("FoodQuantity", sql.Int, FoodQuantity || 0)
      .input("ShelterID", sql.Int, ShelterID || null)
      .input("ShelterPeople", sql.Int, ShelterPeople || 0)
      .input("PriorityLevel", sql.NVarChar, PriorityLevel || "Medium")
      .input("AllocatedBy", sql.Int, AllocatedBy || null)
      .input("Notes", sql.NVarChar, Notes || "")
      .execute("sp_AllocateReliefResources");

    res.json({ success: true, message: "Resources allocated successfully.", data: result.recordset });
  } catch (err) { next(err); }
};

exports.complete = async (req, res, next) => {
  try {
    const pool = await getPool();
    await pool.request()
      .input("AllocationID", sql.Int, req.params.id)
      .query("UPDATE Allocations SET AllocationStatus='Completed' WHERE AllocationID=@AllocationID");
    res.json({ success: true, message: "Allocation marked as completed." });
  } catch (err) { next(err); }
};