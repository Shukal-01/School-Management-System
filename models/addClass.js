const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., "Grade 1"
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
