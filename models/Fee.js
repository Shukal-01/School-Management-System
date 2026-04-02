const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    admissionFee: { type: Number, required: true },
    tuitionFee: { type: Number, required: true },
    examFee: { type: Number, required: true },
    other: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fee", feeSchema);
