const Section = require("../models/addSection.js");

// Add a new section
const addSection = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newSection = new Section({ name, description });
    await newSection.save();
    res.status(201).json({
      success: true,
      message: "Section added successfully",
      data: newSection,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all sections with pagination and optional filtering by teacher or classId
const getAllSection = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const query = {};

    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      query.$or = [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
      ];
    }

    const sections = await Section.find(query)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Section.countDocuments(query);

    res.status(200).json({
      success: true,
      data: sections,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get section by ID
const getSectionById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }
    res.status(200).json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update section by ID
const updateSection = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedSection = await Section.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    if (!updatedSection) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }
    res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete section by ID
const deleteSection = async (req, res) => {
  try {
    const deletedSection = await Section.findByIdAndDelete(req.params.id);
    if (!deletedSection) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Section deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addSection,
  getAllSection,
  getSectionById,
  updateSection,
  deleteSection,
};
