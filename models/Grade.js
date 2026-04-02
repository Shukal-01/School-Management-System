const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema(
  {
    gradeName: { type: String, required: true },
    gradePoint: { type: Number, required: true },
    minMark: { type: Number, required: true },
    maxMark: { type: Number, required: true },
    remark: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Grade", gradeSchema);
