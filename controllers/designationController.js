const Department = require("../models/Department");
const Designation = require("../models/Designation");

// 📌 Add a new designation
const addDesignation = async (req, res) => {
  try {
    const {
      designationName,
      associatedDepartment,
      status,
      designationCode,
      roleDescription,
    } = req.body;

    const newDesignation = new Designation({
      designationName,
      associatedDepartment,
      status,
      designationCode,
      roleDescription,
    });
    await newDesignation.save();

    res.status(201).json({
      success: true,
      message: "Designation added successfully",
      data: newDesignation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllDesignation = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      designationName,
      status,
      associatedDepartment,
      search,
    } = req.query;

    const query = {};

    // 🔵 Search by designation fields
    if (designationName) {
      query.designationName = { $regex: designationName, $options: "i" };
    }
    if (status) {
      query.status = status;
    }

    // 🔵 If department name is given instead of ObjectId
    if (associatedDepartment) {
      const departments = await Department.find({
        deptName: { $regex: associatedDepartment, $options: "i" },
      });

      if (departments.length > 0) {
        query.associatedDepartment = { $in: departments.map((d) => d._id) };
      } else {
        return res.status(404).json({
          success: false,
          message: `No department found matching "${associatedDepartment}"`,
        });
      }
    }

    // 🔍 Free text search on multiple fields
    if (search) {
      query.$or = [
        { designationName: { $regex: search, $options: "i" } },
        { designationCode: { $regex: search, $options: "i" } },
        { roleDescription: { $regex: search, $options: "i" } },
      ];
    }

    const designations = await Designation.find(query)
      .populate("associatedDepartment")
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Designation.countDocuments(query);

    res.status(200).json({
      success: true,
      data: designations,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// 📌 Get designation by ID
const getDesignationById = async (req, res) => {
  try {
    const designation = await Designation.findById(req.params.id).populate("associatedDepartment");
    if (!designation) {
      return res
        .status(404)
        .json({ success: false, message: "Designation not found" });
    }
    res.status(200).json({ success: true, data: designation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Update designation
const updateDesignation = async (req, res) => {
  try {
    const {
      designationName,
      associatedDepartment,
      status,
      designationCode,
      roleDescription,
    } = req.body;

    const updatedDesignation = await Designation.findByIdAndUpdate(
      req.params.id,
      {
        designationName,
        associatedDepartment,
        status,
        designationCode,
        roleDescription,
      },
      { new: true }
    ).populate("associatedDepartment");

    if (!updatedDesignation) {
      return res
        .status(404)
        .json({ success: false, message: "Designation not found" });
    }

    res.status(200).json({
      success: true,
      message: "Designation updated successfully",
      data: updatedDesignation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Delete designation
const deleteDesignation = async (req, res) => {
  try {
    const deletedDesignation = await Designation.findByIdAndDelete(req.params.id);
    if (!deletedDesignation) {
      return res
        .status(404)
        .json({ success: false, message: "Designation not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Designation deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addDesignation,
  getAllDesignation,
  getDesignationById,
  updateDesignation,
  deleteDesignation,
};
