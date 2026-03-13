const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    otp: {
      code: String,
      expiresAt: Date,
      attempts: {
        type: Number,
        default: 0,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshTokens: [String],
    profile: {
      name: String,
      email: String,
      avatar: String,
    },
    role: {
      type: String,
      enum: ["driver", "station_operator"],
      default: "driver",
    },
    vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],
    selectedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
