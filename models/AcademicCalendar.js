const mongoose = require("mongoose");

const academicCalendarSchema = new mongoose.Schema(
  {
    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["Holiday", "Exam", "Event", "Other"],
      required: true,
    },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    noOfDays: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AcademicCalendar", academicCalendarSchema);
