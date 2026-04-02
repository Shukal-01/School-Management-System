const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  allDay: {
    type: Boolean,
    default: false,
  },
});

const Calendar = mongoose.model("Calendar", calendarSchema);

module.exports = Calendar;
