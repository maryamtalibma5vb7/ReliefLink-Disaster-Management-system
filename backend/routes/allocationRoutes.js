const router = require("express").Router();
const controller = require("../controllers/allocationController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.get("/", requireAuth, controller.getAll);
router.post("/", requireAuth, requireRole("Admin", "Operator"), controller.allocate);
router.put("/:id/complete", requireAuth, requireRole("Admin", "Operator"), controller.complete);

module.exports = router;