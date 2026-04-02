// 📌 Add a new exam schedule
const ExamSchedule = require("../models/examSchedule.js");
// const Category = require("../models/Category.js");
const Subject = require("../models/addSubject.js");
const Class = require("../models/addClass.js");
const Section = require("../models/addSection.js");
const ExamCategory = require("../models/examCategory.js");

const addExamSchedule = async (req, res) => {
  try {
    const {
      selectExamCategory,
      subjectName,
      setMaximumMarksOfPaper,
      selectClass,
      selectSection,
      selectTimeStamp,
      selectDate,
    } = req.body;

    // Check if the referenced Exam Category exists
    const categoryExists = await ExamCategory.findById(selectExamCategory);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Exam Category not found. Please provide a valid category.",
      });
    }

    // Check if the referenced Subject exists
    const subjectExists = await Subject.findById(subjectName);
    if (!subjectExists) {
      return res.status(400).json({
        success: false,
        message: "Subject not found. Please provide a valid subject.",
      });
    }

    // Check if the referenced Class exists
    const classExists = await Class.findById(selectClass);
    if (!classExists) {
      return res.status(400).json({
        success: false,
        message: "Class not found. Please provide a valid class.",
      });
    }

    // Check if the referenced Section exists
    const sectionExists = await Section.findById(selectSection);
    if (!sectionExists) {
      return res.status(400).json({
        success: false,
        message: "Section not found. Please provide a valid section.",
      });
    }

    const newExamSchedule = new ExamSchedule({
      selectExamCategory,
      subjectName,
      setMaximumMarksOfPaper,
      selectClass,
      selectSection,
      selectTimeStamp,
      selectDate,
    });

    await newExamSchedule.save();

    res.status(201).json({
      success: true,
      message: "Exam schedule added successfully",
      data: newExamSchedule,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addExamSchedule };

// 📌 Get all exam schedules with pagination and filtering
const getAllExamSchedules = async (req, res) => {
  try {
    let { page = 1, limit = 10, examCategoryName, subjectName, selectDate } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    // Filter selectDate directly from DB
    if (selectDate) {
      query.selectDate = new Date(selectDate);
    }

    // Fetch and populate all data first (basic filtering only on selectDate here)
    let examSchedules = await ExamSchedule.find(query)
      .populate("selectExamCategory")
      .populate("subjectName")
      .populate("selectClass")
      .populate("selectSection")
      .skip((page - 1) * limit)
      .limit(limit);

    // Filter examCategoryName
    if (examCategoryName) {
      examSchedules = examSchedules.filter(schedule =>
        schedule.selectExamCategory?.examCategoryName
          ?.toLowerCase()
          .includes(examCategoryName.toLowerCase())
      );
    }

    // Filter subjectName
    if (subjectName) {
      examSchedules = examSchedules.filter(schedule =>
        schedule.subjectName?.subjectName
          ?.toLowerCase()
          .includes(subjectName.toLowerCase())
      );
    }

    const total = examSchedules.length;

    res.status(200).json({
      success: true,
      data: examSchedules,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get exam schedule by ID
const getExamScheduleById = async (req, res) => {
  try {
    const examSchedule = await ExamSchedule.findById(req.params.id)
      .populate("selectExamCategory", "categoryName categoryCode")
      .populate("subjectName", "subjectName subjectCode")
      .populate("selectClass", "name")
      .populate("selectSection", "name");

    if (!examSchedule) {
      return res
        .status(404)
        .json({ success: false, message: "Exam schedule not found" });
    }
    res.status(200).json({ success: true, data: examSchedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Update exam schedule
const updateExamSchedule = async (req, res) => {
  try {
    const {
      selectExamCategory,
      subjectName,
      setMaximumMarksOfPaper,
      selectClass,
      selectSection,
      selectTimeStamp,
      selectDate,
    } = req.body;

    const updatedExamSchedule = await ExamSchedule.findByIdAndUpdate(
      req.params.id,
      {
        selectExamCategory,
        subjectName,
        setMaximumMarksOfPaper,
        selectClass,
        selectSection,
        selectTimeStamp,
        selectDate,
      },
      { new: true }
    );

    if (!updatedExamSchedule) {
      return res
        .status(404)
        .json({ success: false, message: "Exam schedule not found" });
    }

    res.status(200).json({
      success: true,
      message: "Exam schedule updated successfully",
      data: updatedExamSchedule,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Delete exam schedule
const deleteExamSchedule = async (req, res) => {
  try {
    const deletedExamSchedule = await ExamSchedule.findByIdAndDelete(
      req.params.id
    );
    if (!deletedExamSchedule) {
      return res
        .status(404)
        .json({ success: false, message: "Exam schedule not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Exam schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addExamSchedule,
  getAllExamSchedules,
  getExamScheduleById,
  updateExamSchedule,
  deleteExamSchedule,
};
