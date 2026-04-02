const Category = require("../models/Category");

// Helper to format Mongoose duplicate key error
const getDuplicateErrorMessage = (error) => {
  if (error.code && error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return `${field} must be unique. The provided value already exists.`;
  }
  return error.message;
};

// 📌 Add a new category
const addCategory = async (req, res) => {
  try {
    const { categoryName, categoryCode, status, description } = req.body;
    const newCategory = new Category({
      categoryName,
      categoryCode,
      status,
      description,
    });
    await newCategory.save();
    res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: getDuplicateErrorMessage(error) });
  }
};

// 📌 Get all categories with filter, multi-field search, and pagination
const getAllCategory = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      categoryName = "",
      categoryCode = "",
      status,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    // Multi-field search using $or
    // if (search) {
    //   const regex = { $regex: search, $options: "i" };
    //   query.$or = [
    //     { categoryName: regex },
    //     { categoryCode: regex },
    //     { description: regex },
    //     { status: regex },
    //   ];
    // }
    if (categoryName) {
      query.categoryName = { $regex: categoryName, $options: "i" };
    }
    if (categoryCode) {
      query.categoryCode = { $regex: categoryCode, $options: "i" };
    }

    // Optional status filter (overrides the status in $or if both are used)
    if (status) {
      query.status = status;
    }

    // Sorting logic
    const sortOption = {};
    sortOption[sortBy] = order === "asc" ? 1 : -1;

    // Fetch filtered + paginated data
    const categories = await Category.find(query)
      .sort(sortOption)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    // Total count for pagination
    const total = await Category.countDocuments(query);

    res.status(200).json({
      success: true,
      data: categories,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Update category
const updateCategory = async (req, res) => {
  try {
    const { categoryName, categoryCode, status, description } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { categoryName, categoryCode, status, description },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: getDuplicateErrorMessage(error) });
  }
};

// 📌 Delete category
const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
