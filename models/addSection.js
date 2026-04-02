const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "A"
    description: { type: String, required: true }, // e.g., "A"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Section", sectionSchema);
