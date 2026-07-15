IF DB_ID('ReliefLinkDB') IS NOT NULL
BEGIN
    ALTER DATABASE ReliefLinkDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE ReliefLinkDB;
END
GO

CREATE DATABASE ReliefLinkDB;
GO
USE ReliefLinkDB;
GO

CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(120) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    RoleName NVARCHAR(30) NOT NULL DEFAULT 'Operator',
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE DisasterTypes (
    DisasterTypeID INT IDENTITY(1,1) PRIMARY KEY,
    TypeName NVARCHAR(80) NOT NULL UNIQUE,
    Description NVARCHAR(300) NULL
);
GO

CREATE TABLE Disasters (
    DisasterID INT IDENTITY(1,1) PRIMARY KEY,
    DisasterTypeID INT NOT NULL,
    DisasterName NVARCHAR(150) NOT NULL,
    LocationName NVARCHAR(150) NOT NULL,
    Severity NVARCHAR(20) NOT NULL CHECK (Severity IN ('Low','Medium','High','Critical')),
    AffectedPeople INT NOT NULL CHECK (AffectedPeople >= 0),
    DisasterDate DATE NOT NULL,
    Status NVARCHAR(30) NOT NULL DEFAULT 'Active' CHECK (Status IN ('Active','Under Control','Closed')),
    Description NVARCHAR(500) NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Disasters_DisasterTypes FOREIGN KEY (DisasterTypeID) REFERENCES DisasterTypes(DisasterTypeID)
);
GO

CREATE TABLE Ambulances (
    AmbulanceID INT IDENTITY(1,1) PRIMARY KEY,
    VehicleNo NVARCHAR(50) NOT NULL UNIQUE,
    DriverName NVARCHAR(120) NOT NULL,
    DriverPhone NVARCHAR(30) NOT NULL,
    BaseLocation NVARCHAR(150) NOT NULL,
    CurrentStatus NVARCHAR(30) NOT NULL DEFAULT 'Available' CHECK (CurrentStatus IN ('Available','Allocated','Maintenance')),
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE FoodSupplies (
    FoodID INT IDENTITY(1,1) PRIMARY KEY,
    FoodName NVARCHAR(120) NOT NULL,
    UnitName NVARCHAR(50) NOT NULL DEFAULT 'Packets',
    QuantityAvailable INT NOT NULL CHECK (QuantityAvailable >= 0),
    ExpiryDate DATE NULL,
    StorageLocation NVARCHAR(150) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE Shelters (
    ShelterID INT IDENTITY(1,1) PRIMARY KEY,
    ShelterName NVARCHAR(150) NOT NULL,
    LocationName NVARCHAR(150) NOT NULL,
    TotalCapacity INT NOT NULL CHECK (TotalCapacity >= 0),
    AvailableCapacity INT NOT NULL CHECK (AvailableCapacity >= 0),
    ContactPerson NVARCHAR(120) NULL,
    ContactPhone NVARCHAR(30) NULL,
    CurrentStatus NVARCHAR(30) NOT NULL DEFAULT 'Open' CHECK (CurrentStatus IN ('Open','Full','Closed')),
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT CK_Shelter_Capacity CHECK (AvailableCapacity <= TotalCapacity)
);
GO

CREATE TABLE Allocations (
    AllocationID INT IDENTITY(1,1) PRIMARY KEY,
    DisasterID INT NOT NULL,
    AmbulanceID INT NULL,
    FoodID INT NULL,
    ShelterID INT NULL,
    FoodQuantity INT NOT NULL DEFAULT 0 CHECK (FoodQuantity >= 0),
    ShelterPeople INT NOT NULL DEFAULT 0 CHECK (ShelterPeople >= 0),
    PriorityLevel NVARCHAR(20) NOT NULL CHECK (PriorityLevel IN ('Low','Medium','High','Critical')),
    AllocationStatus NVARCHAR(30) NOT NULL DEFAULT 'Allocated' CHECK (AllocationStatus IN ('Allocated','Completed','Cancelled')),
    AllocatedBy INT NULL,
    AllocationDate DATETIME NOT NULL DEFAULT GETDATE(),
    Notes NVARCHAR(500) NULL,
    CONSTRAINT FK_Allocations_Disasters FOREIGN KEY (DisasterID) REFERENCES Disasters(DisasterID),
    CONSTRAINT FK_Allocations_Ambulances FOREIGN KEY (AmbulanceID) REFERENCES Ambulances(AmbulanceID),
    CONSTRAINT FK_Allocations_FoodSupplies FOREIGN KEY (FoodID) REFERENCES FoodSupplies(FoodID),
    CONSTRAINT FK_Allocations_Shelters FOREIGN KEY (ShelterID) REFERENCES Shelters(ShelterID),
    CONSTRAINT FK_Allocations_Users FOREIGN KEY (AllocatedBy) REFERENCES Users(UserID)
);
GO

CREATE TABLE ActivityLogs (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ActionName NVARCHAR(100) NOT NULL,
    Detail NVARCHAR(500) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);
GO

INSERT INTO Users (FullName, Email, PasswordHash, RoleName) VALUES
('System Administrator','admin@relieflink.com','admin123','Admin'),
('Maryam Bibi','02-235241-046@student.bahria.edu.pk','maryam123','Operator'),
('Azka Alam','02-235241-055@student.bahria.edu.pk','azka123','Operator'),
('Muhammad Abdullah Afroz Malick','02-235241-019@student.bahria.edu.pk','abdullah123','Operator');
GO

INSERT INTO DisasterTypes (TypeName, Description) VALUES
('Flood','Water overflow causing damage to people, roads and houses'),
('Earthquake','Seismic event causing building damage and injuries'),
('Fire','Fire emergency requiring rapid rescue and medical support'),
('Heatwave','Extreme heat causing health and shelter emergencies'),
('Cyclone','Strong wind and rain emergency requiring evacuation');
GO

INSERT INTO Disasters (DisasterTypeID, DisasterName, LocationName, Severity, AffectedPeople, DisasterDate, Status, Description) VALUES
(1,'Urban Flood Emergency','Karachi South','High',850,'2026-05-02','Active','Flood water entered residential streets.'),
(2,'Earthquake Rescue Operation','Quetta','Critical',1400,'2026-05-04','Active','Multiple buildings damaged.'),
(3,'Warehouse Fire Incident','Lahore Industrial Area','Medium',120,'2026-05-06','Under Control','Medical and ambulance support required.');
GO

INSERT INTO Ambulances (VehicleNo, DriverName, DriverPhone, BaseLocation, CurrentStatus) VALUES
('AMB-101','Ali Raza','03001234567','Karachi South','Available'),
('AMB-102','Hamza Khan','03014567890','Karachi East','Available'),
('AMB-103','Usman Ahmed','03028765432','Lahore','Available'),
('AMB-104','Bilal Shah','03111222333','Quetta','Available'),
('AMB-105','Farhan Malik','03219876543','Islamabad','Maintenance');
GO

INSERT INTO FoodSupplies (FoodName, UnitName, QuantityAvailable, ExpiryDate, StorageLocation) VALUES
('Emergency Food Pack','Packets',2500,'2026-12-31','Karachi Central Warehouse'),
('Clean Drinking Water','Bottles',5000,'2027-01-15','Karachi Central Warehouse'),
('Ready Meal Box','Boxes',1800,'2026-11-20','Lahore Relief Store'),
('Baby Nutrition Pack','Packets',700,'2026-10-10','Quetta Relief Store');
GO

INSERT INTO Shelters (ShelterName, LocationName, TotalCapacity, AvailableCapacity, ContactPerson, ContactPhone, CurrentStatus) VALUES
('Community Hall Shelter','Karachi South',600,600,'Noman Ali','03009998877','Open'),
('School Relief Camp','Karachi East',800,800,'Saba Noor','03117776655','Open'),
('Sports Complex Camp','Quetta',1200,1200,'Danish Khan','03225556644','Open'),
('Town Hall Relief Center','Lahore',500,500,'Hina Aslam','03334445566','Open');
GO

CREATE VIEW vw_DashboardStats AS
SELECT
    (SELECT COUNT(*) FROM Disasters WHERE Status <> 'Closed') AS ActiveDisasters,
    (SELECT COUNT(*) FROM Ambulances WHERE CurrentStatus = 'Available') AS AvailableAmbulances,
    (SELECT ISNULL(SUM(QuantityAvailable),0) FROM FoodSupplies) AS AvailableFoodUnits,
    (SELECT ISNULL(SUM(AvailableCapacity),0) FROM Shelters WHERE CurrentStatus = 'Open') AS AvailableShelterCapacity,
    (SELECT COUNT(*) FROM Allocations) AS TotalAllocations;
GO

CREATE VIEW vw_AllocationReport AS
SELECT
    a.AllocationID,
    d.DisasterName,
    dt.TypeName AS DisasterType,
    d.LocationName AS DisasterLocation,
    d.Severity,
    amb.VehicleNo AS AmbulanceNo,
    f.FoodName,
    a.FoodQuantity,
    s.ShelterName,
    a.ShelterPeople,
    a.PriorityLevel,
    a.AllocationStatus,
    u.FullName AS AllocatedBy,
    a.AllocationDate,
    a.Notes
FROM Allocations a
INNER JOIN Disasters d ON a.DisasterID = d.DisasterID
INNER JOIN DisasterTypes dt ON d.DisasterTypeID = dt.DisasterTypeID
LEFT JOIN Ambulances amb ON a.AmbulanceID = amb.AmbulanceID
LEFT JOIN FoodSupplies f ON a.FoodID = f.FoodID
LEFT JOIN Shelters s ON a.ShelterID = s.ShelterID
LEFT JOIN Users u ON a.AllocatedBy = u.UserID;
GO

CREATE FUNCTION fn_DisasterUrgencyScore
(
    @Severity NVARCHAR(20),
    @AffectedPeople INT
)
RETURNS INT
AS
BEGIN
    DECLARE @Score INT;
    SET @Score =
        CASE @Severity
            WHEN 'Critical' THEN 100
            WHEN 'High' THEN 75
            WHEN 'Medium' THEN 50
            ELSE 25
        END
        + CASE
            WHEN @AffectedPeople >= 1000 THEN 30
            WHEN @AffectedPeople >= 500 THEN 20
            WHEN @AffectedPeople >= 100 THEN 10
            ELSE 5
        END;
    RETURN @Score;
END;
GO

CREATE PROCEDURE sp_AllocateReliefResources
    @DisasterID INT,
    @AmbulanceID INT = NULL,
    @FoodID INT = NULL,
    @FoodQuantity INT = 0,
    @ShelterID INT = NULL,
    @ShelterPeople INT = 0,
    @PriorityLevel NVARCHAR(20),
    @AllocatedBy INT = NULL,
    @Notes NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS (SELECT 1 FROM Disasters WHERE DisasterID = @DisasterID)
            THROW 50001, 'Invalid Disaster ID.', 1;

        IF @AmbulanceID IS NOT NULL
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM Ambulances WHERE AmbulanceID = @AmbulanceID AND CurrentStatus = 'Available')
                THROW 50002, 'Selected ambulance is not available.', 1;

            UPDATE Ambulances
            SET CurrentStatus = 'Allocated'
            WHERE AmbulanceID = @AmbulanceID;
        END

        IF @FoodID IS NOT NULL AND @FoodQuantity > 0
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM FoodSupplies WHERE FoodID = @FoodID AND QuantityAvailable >= @FoodQuantity)
                THROW 50003, 'Food quantity is not available.', 1;

            UPDATE FoodSupplies
            SET QuantityAvailable = QuantityAvailable - @FoodQuantity
            WHERE FoodID = @FoodID;
        END

        IF @ShelterID IS NOT NULL AND @ShelterPeople > 0
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM Shelters WHERE ShelterID = @ShelterID AND CurrentStatus = 'Open' AND AvailableCapacity >= @ShelterPeople)
                THROW 50004, 'Shelter capacity is not available.', 1;

            UPDATE Shelters
            SET AvailableCapacity = AvailableCapacity - @ShelterPeople,
                CurrentStatus = CASE WHEN AvailableCapacity - @ShelterPeople = 0 THEN 'Full' ELSE 'Open' END
            WHERE ShelterID = @ShelterID;
        END

        INSERT INTO Allocations
        (DisasterID, AmbulanceID, FoodID, ShelterID, FoodQuantity, ShelterPeople, PriorityLevel, AllocatedBy, Notes)
        VALUES
        (@DisasterID, @AmbulanceID, @FoodID, @ShelterID, @FoodQuantity, @ShelterPeople, @PriorityLevel, @AllocatedBy, @Notes);

        INSERT INTO ActivityLogs(ActionName, Detail)
        VALUES ('Resource Allocation', CONCAT('Resources allocated to DisasterID ', @DisasterID));

        COMMIT TRANSACTION;

        SELECT SCOPE_IDENTITY() AS NewAllocationID, 'Allocation completed successfully.' AS Message;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

CREATE TRIGGER trg_AfterDisasterInsert
ON Disasters
AFTER INSERT
AS
BEGIN
    INSERT INTO ActivityLogs(ActionName, Detail)
    SELECT 'Disaster Added', CONCAT('New disaster added: ', DisasterName, ' at ', LocationName)
    FROM inserted;
END;
GO

CREATE INDEX IX_Disasters_Status_Severity ON Disasters(Status, Severity);
CREATE INDEX IX_Ambulances_Status ON Ambulances(CurrentStatus);
CREATE INDEX IX_Allocations_Date ON Allocations(AllocationDate);
GO