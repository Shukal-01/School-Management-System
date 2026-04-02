const mongoose = require("mongoose");

const designationSchema = new mongoose.Schema(
  {
    designationName: { type: String, required: true },
    associatedDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    designationCode: { type: String, required: true, unique: true },
    roleDescription: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Designation", designationSchema);
