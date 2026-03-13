const Vehicle = require("../models/Vehicles");
const User = require("../models/User");

exports.createVehicle = async (req, res) => {
  try {
    const { make, model, year, licensePlate, fuelType } = req.body;

    const vehicle = new Vehicle({
      make,
      model,
      year,
      licensePlate,
      fuelType,
      userId: req.user._id,
    });

    await vehicle.save();

    req.user.vehicles.push(vehicle._id);
    if (!req.user.selectedVehicle) {
      req.user.selectedVehicle = vehicle._id; // default first vehicle
    }
    await req.user.save();

    res.status(201).json({ success: true, vehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      updates,
      { new: true }
    );

    if (!vehicle)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });

    res.json({ success: true, vehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });
    if (!vehicle)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });

    req.user.vehicles = req.user.vehicles.filter((v) => v.toString() !== id);
    if (req.user.selectedVehicle?.toString() === id) {
      req.user.selectedVehicle = req.user.vehicles[0] || null;
    }
    await req.user.save();

    res.json({ success: true, message: "Vehicle deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.setSelectedVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user.vehicles.map((v) => v.toString()).includes(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Vehicle not owned by user" });
    }

    req.user.selectedVehicle = id;
    await req.user.save();

    res.json({ success: true, selectedVehicle: id });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
