const Department = require("../models/Department");

// 📌 Add a new department
const addDepartment = async (req, res) => {
  try {
    const {
      deptName,
      deptHead,
      deptHeadMobile,
      deptHeadEmail,
      description,
      noOfStaff,
    } = req.body;

    const newDepartment = new Department({
      deptName,
      deptHead,
      deptHeadMobile,
      deptHeadEmail,
      description,
      noOfStaff,
    });
    await newDepartment.save();

    res.status(201).json({
      success: true,
      message: "Department added successfully",
      data: newDepartment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllDepartment = async (req, res) => {
  try {
    const { page = 1, limit = 10, deptName, deptHead, search } = req.query;
    const query = {};

    // Filter if direct match search is provided
    if (search && deptName !== undefined) {
      query.deptName = { $regex: search, $options: "i" };
    } else if (search && deptHead !== undefined) {
      query.deptHead = { $regex: search, $options: "i" };
    } else {
      // fallback to normal filtering if no search is used
      if (deptName) {
        query.deptName = { $regex: deptName, $options: "i" };
      }
      if (deptHead) {
        query.deptHead = { $regex: deptHead, $options: "i" };
      }
    }

    const departments = await Department.find(query)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Department.countDocuments(query);

    res.status(200).json({
      success: true,
      data: departments,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// 📌 Get department by ID
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }
    res.status(200).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Update department
const updateDepartment = async (req, res) => {
  try {
    const {
      deptName,
      deptHead,
      deptHeadMobile,
      deptHeadEmail,
      description,
      noOfStaff,
    } = req.body;

    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      {
        deptName,
        deptHead,
        deptHeadMobile,
        deptHeadEmail,
        description,
        noOfStaff,
      },
      { new: true }
    );

    if (!updatedDepartment) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: updatedDepartment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Delete department
const deleteDepartment = async (req, res) => {
  try {
    const deletedDepartment = await Department.findByIdAndDelete(req.params.id);
    if (!deletedDepartment) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }
    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addDepartment,
  getAllDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
