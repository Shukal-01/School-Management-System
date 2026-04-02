const mongoose = require("mongoose");

const religionSchema = new mongoose.Schema(
  {
    religionName: { type: String, required: true },
    religionCode: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Religion", religionSchema);
