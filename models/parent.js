const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema(
  {
    parentFirstName: { type: String, required: true },
    parentLastName: { type: String, required: true },
    parentEmail: { type: String, required: true, unique: true },
    parentPhone: { type: String, required: true, unique: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    occupation: { type: String },
    parentRelation: { type: String }, // Relation to the student (e.g., "Father", "Mother")
    parentAddress1: { type: String },
    parentAddress2: { type: String },
    parent_city_district: { type: String },
    parent_state_province: { type: String },
    credentials: {
      id: { type: String },
      password: { type: String },
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parent", parentSchema);
