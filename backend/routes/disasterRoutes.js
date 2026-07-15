const router = require("express").Router();
const controller = require("../controllers/disasterController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.get("/types", requireAuth, controller.getTypes);
router.get("/", requireAuth, controller.getAll);
router.get("/:id", requireAuth, controller.getById);
router.post("/", requireAuth, requireRole("Admin"), controller.create);
router.put("/:id", requireAuth, requireRole("Admin"), controller.update);
router.delete("/:id", requireAuth, requireRole("Admin"), controller.remove);

module.exports = router;