const router = require("express").Router();
const controller = require("../controllers/resourceController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.get("/ambulances", requireAuth, controller.getAmbulances);
router.post("/ambulances", requireAuth, requireRole("Admin", "Operator"), controller.createAmbulance);
router.put("/ambulances/:id", requireAuth, requireRole("Admin", "Operator"), controller.updateAmbulance);
router.delete("/ambulances/:id", requireAuth, requireRole("Admin"), controller.deleteAmbulance);

router.get("/food", requireAuth, controller.getFood);
router.post("/food", requireAuth, requireRole("Admin", "Operator"), controller.createFood);
router.put("/food/:id", requireAuth, requireRole("Admin", "Operator"), controller.updateFood);
router.delete("/food/:id", requireAuth, requireRole("Admin"), controller.deleteFood);

router.get("/shelters", requireAuth, controller.getShelters);
router.post("/shelters", requireAuth, requireRole("Admin", "Operator"), controller.createShelter);
router.put("/shelters/:id", requireAuth, requireRole("Admin", "Operator"), controller.updateShelter);
router.delete("/shelters/:id", requireAuth, requireRole("Admin"), controller.deleteShelter);

module.exports = router;