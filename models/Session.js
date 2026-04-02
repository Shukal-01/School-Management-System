const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    sessionName: { type: String, required: true, unique: true },
    isSessionOpen: { type: String, required: true },// change into enum (yes, no, upcoming)
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
