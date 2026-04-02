const AcademicCalendar = require("../models/AcademicCalendar.js");

// 📌 Add a new academic calendar entry
const addAcademic = async (req, res) => {
  try {
    const {
      academicSession,
      name,
      type,
      description,
      startDate,
      endDate,
      noOfDays,
    } = req.body;

    const newAcademicCalendar = new AcademicCalendar({
      academicSession,
      name,
      type,
      description,
      startDate,
      endDate,
      noOfDays,
    });
    await newAcademicCalendar.save();

    res.status(201).json({
      success: true,
      message: "Academic calendar entry added successfully",
      data: newAcademicCalendar,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllAcademic = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, academicSession, name, search } = req.query;
    const query = {};

    // Optional filter by type (e.g., Holiday, Exam, Event, Other)
    if (type) {
      query.type = { $regex: type, $options: "i" }; // case-insensitive search
    }

    if (name) {
      query.name = { $regex: name, $options: "i" }; // case-insensitive search
    }

    // Optional filter by academicSession ID
    if (academicSession) {
      query.academicSession = academicSession;
    }

    // Search by keyword in name, description, or type
    if (search) {
      const searchRegex = new RegExp(search, "i"); // case-insensitive
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { type: searchRegex },
      ];
    }

    const calendarEntries = await AcademicCalendar.find(query)
      .populate("academicSession")
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await AcademicCalendar.countDocuments(query);

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

// 📌 Get academic calendar entry by ID
const getAcademicById = async (req, res) => {
  try {
    const entry = await AcademicCalendar.findById(req.params.id).populate("academicSession");
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Academic calendar entry not found",
      });
    }
    res.status(200).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Update academic calendar entry
const updateAcademic = async (req, res) => {
  try {
    const {
      academicSession,
      name,
      type,
      description,
      startDate,
      endDate,
      noOfDays,
    } = req.body;

    const updatedEntry = await AcademicCalendar.findByIdAndUpdate(
      req.params.id,
      {
        academicSession,
        name,
        type,
        description,
        startDate,
        endDate,
        noOfDays,
      },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({
        success: false,
        message: "Academic calendar entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Academic calendar entry updated successfully",
      data: updatedEntry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Delete academic calendar entry
const deleteAcademic = async (req, res) => {
  try {
    const deletedEntry = await AcademicCalendar.findByIdAndDelete(req.params.id);
    if (!deletedEntry) {
      return res.status(404).json({
        success: false,
        message: "Academic calendar entry not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Academic calendar entry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addAcademic,
  getAllAcademic,
  getAcademicById,
  updateAcademic,
  deleteAcademic,
};
