// parentController.js
const Parent = require("../models/parent");
const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");

// Get all parents with filtering and search query
const getAllParent = async (req, res) => {
  try {
    // Destructure query params
    const { page = 1, limit = 10, name, email } = req.query;

    // Prepare a filter object for queries
    const filters = {};

    // If there's a search query, perform a case-insensitive search on parent's details
    if (name) {
      filters.$or = [
        { parentFirstName: new RegExp(name, "i") }, // Search by parent's first name
      ];
    }

    // If there's a gender query, filter by gender
    if (email) filters.parentEmail = email;

    // Pagination calculation
    const skip = (page - 1) * limit;

    // Fetch parent details based on filters and pagination
    const parents = await Parent.find(filters)
      // .populate("students")
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count of matching records for pagination
    const totalParents = await Parent.countDocuments(filters);

    if (!parents || parents.length === 0) {
      return res.status(404).json({ message: "No parents found!" });
    }

    // Return the paginated and filtered response
    res.status(200).json({
      message: "Parent details retrieved successfully!",
      data: parents,
      total: totalParents,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalParents / limit),
    });
  } catch (error) {
    console.error("Error fetching parent details:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Get parent by ID
getParentById = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id).populate("students");
    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }
    res.status(200).json(parent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get parent by student ID
getParentByStudentId = async (req, res) => {
  try {
    const parent = await Parent.find({ students: req.params.studentId });
    if (!parent.length) {
      return res
        .status(404)
        .json({ message: "No parent found for this student" });
    }
    res.status(200).json(parent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete parent by ID
deleteParent = async (req, res) => {
  try {
    const parent = await Parent.findByIdAndDelete(req.params.id);
    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }
    res.status(200).json({ message: "Parent deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update parent by ID
updateParent = async (req, res) => {
  try {
    const parent = await Parent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }
    res.status(200).json(parent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Block parent by ID
blockParent = async (req, res) => {
  try {
    const parent = await Parent.findByIdAndUpdate(
      req.params.id,
      { blocked: true }, // Assuming you have added a blocked field in the schema
      { new: true }
    );
    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }
    res.status(200).json({ message: "Parent blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download parent data as CSV
downloadParents = async (req, res) => {
  try {
    const parents = await Parent.find(); // Get all parents or apply filter if needed
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(parents);

    const filePath = path.join(__dirname, "parents.csv");
    fs.writeFileSync(filePath, csv); // Write CSV to a file (you can adjust file location as needed)

    res.download(filePath, "parents.csv", (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error downloading the file.");
      }
      fs.unlinkSync(filePath); // Delete the file after download
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllParent,
  getParentById,
  getParentByStudentId,
  deleteParent,
  updateParent,
  blockParent,
  downloadParents,
};
