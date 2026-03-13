const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    make: String,
    model: String,
    year: Number,
    licensePlate: { type: String, unique: true },
    fuelType: {
      type: String,
      enum: ["gasoline", "diesel", "electric", "hybrid"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

modult.exports = mongoose.model("Vehicle", vehicleSchema);
