const router = require("express").Router();
const controller = require("../controllers/reportController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.get("/dashboard", requireAuth, controller.dashboard);
router.get("/allocation-report", requireAuth, controller.allocationReport);
router.get("/activity-logs", requireAuth, requireRole("Admin"), controller.activityLogs);

module.exports = router;