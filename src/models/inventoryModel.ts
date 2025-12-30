import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  bloodGroup: {
    type: String,
    required: true,
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
  },
  units: {
    type: Number,
    required: true,
    min: 1,
  },
  source: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "dispatched", "expired"],
    default: "available",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Inventory || mongoose.model("Inventory", InventorySchema);