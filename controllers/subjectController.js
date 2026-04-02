const Subject = require("../models/addSubject.js");
const mongoose = require('mongoose');
const { Types: { ObjectId } } = mongoose;

/**
 * GET /api/subjects/class/:classId
 * Returns subjects for a given classId
 */
const getSubjectsByClass = async (req, res) => {
  const { classId } = req.params;

  // Validate classId
  if (!ObjectId.isValid(classId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid classId',
    });
  }

  try {
    const subjects = await Subject.find(
      { classId: new ObjectId(classId) },
      '_id subjectName subjectCode'
    );

    return res.status(200).json({
      success: true,
      count: subjects.length,
      subjects,
    });
  } catch (error) {
    console.error('Error fetching subjects by classId:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching subjects',
      error: error.message,
    });
  }
};

// 📌 Add a new subject
const addSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode, subjectType, classId, description } = req.body;

    const newSubject = new Subject({
      subjectName,
      subjectCode,
      subjectType,
      classId,
      description,
    });
    await newSubject.save();

    res.status(201).json({
      success: true,
      message: "Subject added successfully",
      data: newSubject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get all subjects with pagination and filtering
const getAllSubject = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      subjectName,
      subjectType,
      subjectCode,
      classId,
      className,
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};

    if (subjectName) {
      filter.subjectName = { $regex: subjectName, $options: "i" };
    }

    if (subjectType) {
      filter.subjectType = { $regex: subjectType, $options: "i" };
    }

    if (subjectCode) {
      filter.subjectCode = { $regex: subjectCode, $options: "i" };
    }

    if (classId) {
      filter.classId = classId;
    }

    let subjects = await Subject.find(filter)
      .populate("classId", "name")
      .skip((page - 1) * limit)
      .limit(limit);

    // Filter by className manually after population
    if (className) {
      subjects = subjects.filter((subj) =>
        subj.classId?.name?.toLowerCase().includes(className.toLowerCase())
      );
    }

    const total = await Subject.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: subjects,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// 📌 Get subject by ID
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate("classId", "name");
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Update subject
const updateSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode, subjectType, classId, description } = req.body;

    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      { subjectName, subjectCode, subjectType, classId, description },
      { new: true }
    );

    if (!updatedSubject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: updatedSubject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Delete subject
const deleteSubject = async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    if (!deletedSubject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }
    res.status(200).json({ success: true, message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addSubject,
  getAllSubject,
  getSubjectById,
  updateSubject,
  deleteSubject,
  getSubjectsByClass,
};
