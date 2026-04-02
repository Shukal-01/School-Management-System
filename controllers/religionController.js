const Religion = require("../models/Religion");

// 📌 Add a new religion
const addReligion = async (req, res) => {
  try {
    const { religionName, religionCode, status, description } = req.body;
    const newReligion = new Religion({
      religionName,
      religionCode,
      status,
      description,
    });
    await newReligion.save();

    res.status(201).json({
      success: true,
      message: "Religion added successfully",
      data: newReligion,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get all religions with pagination and filtering
const getAllReligion = async (req, res) => {
  try {
    const { page = 1, limit = 10, religionName, status, religionCode } = req.query;
    const query = {};

    // Filter by religionName (case-insensitive partial match)
    if (religionName) {
      query.religionName = { $regex: religionName, $options: "i" };
    }

    if (religionCode) {
      query.religionCode = { $regex: religionCode, $options: "i" };
    }

    // Filter by status (exact match)
    if (status) {
      query.status = status;
    }

    const religions = await Religion.find(query)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Religion.countDocuments(query);

    res.status(200).json({
      success: true,
      data: religions,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get religion by ID
const getReligionById = async (req, res) => {
  try {
    const religion = await Religion.findById(req.params.id);
    if (!religion) {
      return res
        .status(404)
        .json({ success: false, message: "Religion not found" });
    }
    res.status(200).json({ success: true, data: religion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Update religion
const updateReligion = async (req, res) => {
  try {
    const { religionName, religionCode, status, description } = req.body;

    const updatedReligion = await Religion.findByIdAndUpdate(
      req.params.id,
      { religionName, religionCode, status, description },
      { new: true }
    );

    if (!updatedReligion) {
      return res
        .status(404)
        .json({ success: false, message: "Religion not found" });
    }

    res.status(200).json({
      success: true,
      message: "Religion updated successfully",
      data: updatedReligion,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Delete religion
const deleteReligion = async (req, res) => {
  try {
    const deletedReligion = await Religion.findByIdAndDelete(req.params.id);
    if (!deletedReligion) {
      return res
        .status(404)
        .json({ success: false, message: "Religion not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Religion deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addReligion,
  getAllReligion,
  getReligionById,
  updateReligion,
  deleteReligion,
};
