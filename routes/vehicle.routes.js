const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const vehicleController = require("../controllers/vehicle.controller");

router.use(authMiddleware);

router.post("/", vehicleController.createVehicle);
router.put("/:id", vehicleController.updateVehicle);
router.delete("/:id", vehicleController.deleteVehicle);
router.post("/:id/select", vehicleController.setSelectedVehicle);

module.exports = router;
