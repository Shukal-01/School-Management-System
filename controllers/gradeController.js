const Grade = require("../models/Grade");

// 📌 Add a new grade
const addGrade = async (req, res) => {
  try {
    const { gradeName, gradePoint, minMark, maxMark, remark } = req.body;
    const newGrade = new Grade({
      gradeName,
      gradePoint,
      minMark,
      maxMark,
      remark,
    });
    await newGrade.save();

    res.status(201).json({
      success: true,
      message: "Grade added successfully",
      data: newGrade,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get all grades with pagination and filtering by gradeName
const getAllGrade = async (req, res) => {
  try {
    const { page = 1, limit = 10, gradeName } = req.query;
    const query = {};

    // Optional filter by gradeName (case-insensitive partial match)
    if (gradeName) {
      query.gradeName = { $regex: gradeName, $options: "i" };
    }

    const grades = await Grade.find(query)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Grade.countDocuments(query);

    res.status(200).json({
      success: true,
      data: grades,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get grade by ID
const getGradeById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) {
      return res
        .status(404)
        .json({ success: false, message: "Grade not found" });
    }
    res.status(200).json({ success: true, data: grade });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Update grade
const updateGrade = async (req, res) => {
  try {
    const { gradeName, gradePoint, minMark, maxMark, remark } = req.body;

    const updatedGrade = await Grade.findByIdAndUpdate(
      req.params.id,
      { gradeName, gradePoint, minMark, maxMark, remark },
      { new: true }
    );

    if (!updatedGrade) {
      return res
        .status(404)
        .json({ success: false, message: "Grade not found" });
    }

    res.status(200).json({
      success: true,
      message: "Grade updated successfully",
      data: updatedGrade,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Delete grade
const deleteGrade = async (req, res) => {
  try {
    const deletedGrade = await Grade.findByIdAndDelete(req.params.id);
    if (!deletedGrade) {
      return res
        .status(404)
        .json({ success: false, message: "Grade not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Grade deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addGrade,
  getAllGrade,
  getGradeById,
  updateGrade,
  deleteGrade,
};
