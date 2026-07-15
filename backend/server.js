const express = require("express");
const cors = require("cors");
require("dotenv").config();

const errorHandler = require("./middleware/errorHandler");
const { testConnection } = require("./config/db");

const app = express();
app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:3000"], credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/", async (req, res, next) => {
  try {
    const db = await testConnection();
    res.json({ success: true, message: "ReliefLink API is running and SQL Server is connected.", ...db });
  } catch (err) { next(err); }
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/disasters", require("./routes/disasterRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));
app.use("/api/allocations", require("./routes/allocationRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

app.use((req, res) => res.status(404).json({ success: false, message: "API route not found." }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`ReliefLink backend running on http://localhost:${PORT}`));
