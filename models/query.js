const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderRole", // Dynamic reference to Parent, Teacher, or Student
    },
    senderRole: {
      type: String,
      required: true,
      enum: ["parent", "teacher", "student"], // Allowed roles
    },
    message: { type: String, required: true },
    adminResponse: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Query", querySchema);
