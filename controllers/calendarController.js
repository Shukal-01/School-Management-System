const Calendar = require("../models/calendar.js");

// Create a new calendar
const createCalendar = async (req, res) => {
  try {
    const { title, startDate, endDate, allDay } = req.body;

    if (!title || !startDate || !endDate) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newCalendar = new Calendar({ title, startDate, endDate, allDay });
    await newCalendar.save();

    res.status(201).json({
      success: true,
      data: newCalendar,
      message: "Calendar entry added successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all calendar entries
// Get all calendar entries with pagination, search, and date filtering
const getCalendar = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      startDate,
      endDate
    } = req.query;

    const query = {};

    // Search by title (case-insensitive)
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Filter by date range if provided
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    const total = await Calendar.countDocuments(query);

    const calendarEntries = await Calendar.find(query)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .sort({ startDate: 1 }); // optional sorting by date

    res.status(200).json({
      success: true,
      data: calendarEntries,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single calendar entry by ID
const getCalendarById = async (req, res) => {
  try {
    const calendarEntry = await Calendar.findById(req.params.id);
    if (!calendarEntry) {
      return res
        .status(404)
        .json({ success: false, message: "Calendar entry not found" });
    }
    res.status(200).json({ success: true, data: calendarEntry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a calendar entry
const updateCalendar = async (req, res) => {
  try {
    const updatedCalendar = await Calendar.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedCalendar) {
      return res
        .status(404)
        .json({ success: false, message: "Calendar entry not found" });
    }
    res.status(200).json({ success: true, data: updatedCalendar });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a calendar entry
const deleteCalendar = async (req, res) => {
  try {
    const deletedCalendar = await Calendar.findByIdAndDelete(req.params.id);
    if (!deletedCalendar) {
      return res
        .status(404)
        .json({ success: false, message: "Calendar entry not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Calendar entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCalendar,
  getCalendar,
  getCalendarById,
  updateCalendar,
  deleteCalendar,
};
