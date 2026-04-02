const express = require("express");
const exanCategoryRouter = express.Router();

const {
    addExamCategory,
    getAllExamCategories,
    getExamCategoryById,
    updateExamCategory,
    deleteExamCategory,
} = require("../controllers/examCategoryController");

// Create a new exam category
exanCategoryRouter.post("/add-category", addExamCategory);

// Get all exam categories
exanCategoryRouter.get("/all-category", getAllExamCategories);

// Get an exam category by ID
exanCategoryRouter.get("/get-category/:id", getExamCategoryById);

// Update an exam category by ID
exanCategoryRouter.put("/update-category/:id", updateExamCategory);

// Delete an exam category by ID
exanCategoryRouter.delete("/delete-category/:id", deleteExamCategory);

module.exports = exanCategoryRouter;
