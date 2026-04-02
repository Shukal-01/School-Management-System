const Fee = require("../models/Fee");
const Class = require("../models/addClass"); // Make sure to import your Class model

// 📌 Add a new fee structure
const addFee = async (req, res) => {
  try {
    const { classId, admissionFee, tuitionFee, examFee, other } = req.body;

    const newFee = new Fee({
      classId,
      admissionFee,
      tuitionFee,
      examFee,
      other,
    });
    await newFee.save();

    res.status(201).json({
      success: true,
      message: "Fee structure added successfully",
      data: newFee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get all fee structures with pagination and filtering
const getAllFee = async (req, res) => {
  try {
    const { page = 1, limit = 10, classId, className } = req.query;
    const query = {};

    // Optional filter by classId
    if (classId) {
      query.classId = classId;
    }

    // Optional filter by className
    if (className) {
      const classDoc = await Class.findOne({  name: { $regex: className, $options: "i" }, });
      if (classDoc) {
        query.classId = classDoc._id;
      } else {
        return res.status(404).json({
          success: false,
          message: `Class with name "${className}" not found`,
        });
      }
    }

    const fees = await Fee.find(query)
      .populate("classId")
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Fee.countDocuments(query);

    res.status(200).json({
      success: true,
      data: fees,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get fee structure by ID
const getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate("classId");
    if (!fee) {
      return res
        .status(404)
        .json({ success: false, message: "Fee structure not found" });
    }
    res.status(200).json({ success: true, data: fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Update fee structure
const updateFee = async (req, res) => {
  try {
    const { classId, admissionFee, tuitionFee, examFee, other } = req.body;

    const updatedFee = await Fee.findByIdAndUpdate(
      req.params.id,
      { classId, admissionFee, tuitionFee, examFee, other },
      { new: true }
    );

    if (!updatedFee) {
      return res
        .status(404)
        .json({ success: false, message: "Fee structure not found" });
    }

    res.status(200).json({
      success: true,
      message: "Fee structure updated successfully",
      data: updatedFee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Delete fee structure
const deleteFee = async (req, res) => {
  try {
    const deletedFee = await Fee.findByIdAndDelete(req.params.id);
    if (!deletedFee) {
      return res
        .status(404)
        .json({ success: false, message: "Fee structure not found" });
    }
    res.status(200).json({
      success: true,
      message: "Fee structure deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addFee, getAllFee, getFeeById, updateFee, deleteFee };
