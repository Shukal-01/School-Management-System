const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    deptName: { type: String, required: true, unique: true },
    deptHead: { type: String, required: true },
    deptHeadMobile: { type: String, required: true },
    deptHeadEmail: { type: String, required: true, unique: true },
    description: { type: String },
    noOfStaff: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
