const { sql, getPool } = require("../config/db");
const { NAME_REGEX, PHONE_REGEX, VEHICLE_REGEX, LOCATION_REGEX } = require("../middleware/auth");

exports.getAmbulances = async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM Ambulances ORDER BY AmbulanceID DESC");
    res.json({ success: true, data: result.recordset });
  } catch (err) { next(err); }
};

exports.createAmbulance = async (req, res, next) => {
  try {
    const { VehicleNo, DriverName, DriverPhone, BaseLocation, CurrentStatus } = req.body;
    if (!VehicleNo || !DriverName || !DriverPhone || !BaseLocation) {
      return res.status(400).json({ success: false, message: "Vehicle number, driver name, driver phone and base location are required." });
    }
    if (!VEHICLE_REGEX.test(VehicleNo.trim())) {
      return res.status(400).json({ success: false, message: "Vehicle number must be 3-20 characters and may include letters, numbers, hyphens and spaces." });
    }
    if (!NAME_REGEX.test(DriverName.trim())) {
      return res.status(400).json({ success: false, message: "Driver name must be 3-64 characters and contain only letters, spaces, apostrophes or hyphens." });
    }
    if (!PHONE_REGEX.test(DriverPhone.trim())) {
      return res.status(400).json({ success: false, message: "Driver phone must be a valid phone number." });
    }
    if (!LOCATION_REGEX.test(BaseLocation.trim())) {
      return res.status(400).json({ success: false, message: "Base location must be 3-80 characters and contain only letters, numbers and punctuation." });
    }

    const pool = await getPool();
    await pool.request()
      .input("VehicleNo", sql.NVarChar, VehicleNo.trim())
      .input("DriverName", sql.NVarChar, DriverName.trim())
      .input("DriverPhone", sql.NVarChar, DriverPhone.trim())
      .input("BaseLocation", sql.NVarChar, BaseLocation.trim())
      .input("CurrentStatus", sql.NVarChar, CurrentStatus || "Available")
      .query("INSERT INTO Ambulances(VehicleNo,DriverName,DriverPhone,BaseLocation,CurrentStatus) VALUES(@VehicleNo,@DriverName,@DriverPhone,@BaseLocation,@CurrentStatus)");
    res.json({ success: true, message: "Ambulance added." });
  } catch (err) { next(err); }
};

exports.updateAmbulance = async (req, res, next) => {
  try {
    const { VehicleNo, DriverName, DriverPhone, BaseLocation, CurrentStatus } = req.body;
    if (!VehicleNo || !DriverName || !DriverPhone || !BaseLocation) {
      return res.status(400).json({ success: false, message: "Vehicle number, driver name, driver phone and base location are required." });
    }
    if (!VEHICLE_REGEX.test(VehicleNo.trim())) {
      return res.status(400).json({ success: false, message: "Vehicle number must be 3-20 characters and may include letters, numbers, hyphens and spaces." });
    }
    if (!NAME_REGEX.test(DriverName.trim())) {
      return res.status(400).json({ success: false, message: "Driver name must be 3-64 characters and contain only letters, spaces, apostrophes or hyphens." });
    }
    if (!PHONE_REGEX.test(DriverPhone.trim())) {
      return res.status(400).json({ success: false, message: "Driver phone must be a valid phone number." });
    }
    if (!LOCATION_REGEX.test(BaseLocation.trim())) {
      return res.status(400).json({ success: false, message: "Base location must be 3-80 characters and contain only letters, numbers and punctuation." });
    }

    const pool = await getPool();
    await pool.request()
      .input("AmbulanceID", sql.Int, req.params.id)
      .input("VehicleNo", sql.NVarChar, VehicleNo.trim())
      .input("DriverName", sql.NVarChar, DriverName.trim())
      .input("DriverPhone", sql.NVarChar, DriverPhone.trim())
      .input("BaseLocation", sql.NVarChar, BaseLocation.trim())
      .input("CurrentStatus", sql.NVarChar, CurrentStatus)
      .query("UPDATE Ambulances SET VehicleNo=@VehicleNo, DriverName=@DriverName, DriverPhone=@DriverPhone, BaseLocation=@BaseLocation, CurrentStatus=@CurrentStatus WHERE AmbulanceID=@AmbulanceID");
    res.json({ success: true, message: "Ambulance updated." });
  } catch (err) { next(err); }
};

exports.deleteAmbulance = async (req, res, next) => {
  try {
    const pool = await getPool();
    await pool.request().input("AmbulanceID", sql.Int, req.params.id).query("DELETE FROM Ambulances WHERE AmbulanceID=@AmbulanceID");
    res.json({ success: true, message: "Ambulance deleted." });
  } catch (err) { next(err); }
};

exports.getFood = async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM FoodSupplies ORDER BY FoodID DESC");
    res.json({ success: true, data: result.recordset });
  } catch (err) { next(err); }
};

exports.createFood = async (req, res, next) => {
  try {
    const { FoodName, UnitName, QuantityAvailable, ExpiryDate, StorageLocation } = req.body;
    const pool = await getPool();
    await pool.request()
      .input("FoodName", sql.NVarChar, FoodName)
      .input("UnitName", sql.NVarChar, UnitName)
      .input("QuantityAvailable", sql.Int, QuantityAvailable)
      .input("ExpiryDate", sql.Date, ExpiryDate || null)
      .input("StorageLocation", sql.NVarChar, StorageLocation)
      .query("INSERT INTO FoodSupplies(FoodName,UnitName,QuantityAvailable,ExpiryDate,StorageLocation) VALUES(@FoodName,@UnitName,@QuantityAvailable,@ExpiryDate,@StorageLocation)");
    res.json({ success: true, message: "Food supply added." });
  } catch (err) { next(err); }
};

exports.updateFood = async (req, res, next) => {
  try {
    const { FoodName, UnitName, QuantityAvailable, ExpiryDate, StorageLocation } = req.body;
    const pool = await getPool();
    await pool.request()
      .input("FoodID", sql.Int, req.params.id)
      .input("FoodName", sql.NVarChar, FoodName)
      .input("UnitName", sql.NVarChar, UnitName)
      .input("QuantityAvailable", sql.Int, QuantityAvailable)
      .input("ExpiryDate", sql.Date, ExpiryDate || null)
      .input("StorageLocation", sql.NVarChar, StorageLocation)
      .query("UPDATE FoodSupplies SET FoodName=@FoodName, UnitName=@UnitName, QuantityAvailable=@QuantityAvailable, ExpiryDate=@ExpiryDate, StorageLocation=@StorageLocation WHERE FoodID=@FoodID");
    res.json({ success: true, message: "Food supply updated." });
  } catch (err) { next(err); }
};

exports.deleteFood = async (req, res, next) => {
  try {
    const pool = await getPool();
    await pool.request().input("FoodID", sql.Int, req.params.id).query("DELETE FROM FoodSupplies WHERE FoodID=@FoodID");
    res.json({ success: true, message: "Food supply deleted." });
  } catch (err) { next(err); }
};

exports.getShelters = async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM Shelters ORDER BY ShelterID DESC");
    res.json({ success: true, data: result.recordset });
  } catch (err) { next(err); }
};

exports.createShelter = async (req, res, next) => {
  try {
    const { ShelterName, LocationName, TotalCapacity, AvailableCapacity, ContactPerson, ContactPhone, CurrentStatus } = req.body;
    if (!ShelterName || !LocationName || TotalCapacity == null || AvailableCapacity == null) {
      return res.status(400).json({ success: false, message: "Shelter name, location, total capacity and available capacity are required." });
    }
    if (ContactPerson && !NAME_REGEX.test(ContactPerson.trim())) {
      return res.status(400).json({ success: false, message: "Contact person name must be 3-64 characters and contain only letters, spaces, apostrophes or hyphens." });
    }
    if (ContactPhone && !PHONE_REGEX.test(ContactPhone.trim())) {
      return res.status(400).json({ success: false, message: "Contact phone must be a valid phone number." });
    }

    const pool = await getPool();
    await pool.request()
      .input("ShelterName", sql.NVarChar, ShelterName.trim())
      .input("LocationName", sql.NVarChar, LocationName.trim())
      .input("TotalCapacity", sql.Int, TotalCapacity)
      .input("AvailableCapacity", sql.Int, AvailableCapacity)
      .input("ContactPerson", sql.NVarChar, ContactPerson ? ContactPerson.trim() : "")
      .input("ContactPhone", sql.NVarChar, ContactPhone ? ContactPhone.trim() : "")
      .input("CurrentStatus", sql.NVarChar, CurrentStatus || "Open")
      .query("INSERT INTO Shelters(ShelterName,LocationName,TotalCapacity,AvailableCapacity,ContactPerson,ContactPhone,CurrentStatus) VALUES(@ShelterName,@LocationName,@TotalCapacity,@AvailableCapacity,@ContactPerson,@ContactPhone,@CurrentStatus)");
    res.json({ success: true, message: "Shelter added." });
  } catch (err) { next(err); }
};

exports.updateShelter = async (req, res, next) => {
  try {
    const { ShelterName, LocationName, TotalCapacity, AvailableCapacity, ContactPerson, ContactPhone, CurrentStatus } = req.body;
    if (!ShelterName || !LocationName || TotalCapacity == null || AvailableCapacity == null) {
      return res.status(400).json({ success: false, message: "Shelter name, location, total capacity and available capacity are required." });
    }
    if (ContactPerson && !NAME_REGEX.test(ContactPerson.trim())) {
      return res.status(400).json({ success: false, message: "Contact person name must be 3-64 characters and contain only letters, spaces, apostrophes or hyphens." });
    }
    if (ContactPhone && !PHONE_REGEX.test(ContactPhone.trim())) {
      return res.status(400).json({ success: false, message: "Contact phone must be a valid phone number." });
    }

    const pool = await getPool();
    await pool.request()
      .input("ShelterID", sql.Int, req.params.id)
      .input("ShelterName", sql.NVarChar, ShelterName.trim())
      .input("LocationName", sql.NVarChar, LocationName.trim())
      .input("TotalCapacity", sql.Int, TotalCapacity)
      .input("AvailableCapacity", sql.Int, AvailableCapacity)
      .input("ContactPerson", sql.NVarChar, ContactPerson ? ContactPerson.trim() : "")
      .input("ContactPhone", sql.NVarChar, ContactPhone ? ContactPhone.trim() : "")
      .input("CurrentStatus", sql.NVarChar, CurrentStatus)
      .query("UPDATE Shelters SET ShelterName=@ShelterName, LocationName=@LocationName, TotalCapacity=@TotalCapacity, AvailableCapacity=@AvailableCapacity, ContactPerson=@ContactPerson, ContactPhone=@ContactPhone, CurrentStatus=@CurrentStatus WHERE ShelterID=@ShelterID");
    res.json({ success: true, message: "Shelter updated." });
  } catch (err) { next(err); }
};

exports.deleteShelter = async (req, res, next) => {
  try {
    const pool = await getPool();
    await pool.request().input("ShelterID", sql.Int, req.params.id).query("DELETE FROM Shelters WHERE ShelterID=@ShelterID");
    res.json({ success: true, message: "Shelter deleted." });
  } catch (err) { next(err); }
};