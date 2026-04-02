const mongoose = require("mongoose");

const noticeBoardSchema = new mongoose.Schema(
  {
    sendTo: { type: [String], required: true }, // Array of strings ["Students", "Teachers", "All"]
    title: { type: String, required: true },
    details: { type: String, required: true },
    categoryTag: { type: String, required: true }, // e.g., "General", "Urgent", "Event"
  },
  { timestamps: true }
);

module.exports = mongoose.model("NoticeBoard", noticeBoardSchema);
