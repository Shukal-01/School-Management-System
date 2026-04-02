const express = require("express");
const {
  createCalendar,
  getCalendar,
  getCalendarById,
  updateCalendar,
  deleteCalendar,
} = require("../controllers/calendarController.js");

const router = express.Router();

// Route to create a new calendar entry
router.post("/create-calendar", createCalendar);

// Route to get all calendar entries
router.get("/all-calendar", getCalendar);

// Route to get a single calendar entry by ID
router.get("/calendar-by-id/:id", getCalendarById);

// Route to update a calendar entry by ID
router.put("/update-calendar/:id", updateCalendar);

// Route to delete a calendar entry by ID
router.delete("/delete-calendar/:id", deleteCalendar);

module.exports = router;
