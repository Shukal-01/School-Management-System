const express = require("express");
const { addCategory, getAllCategory, getCategoryById, updateCategory, deleteCategory } = require("../controllers/categoryController.js");
const categoryRouter = express.Router();

categoryRouter.post("/add-category", addCategory);
categoryRouter.get("/all-category", getAllCategory);
categoryRouter.get("/get-category/:id", getCategoryById);
categoryRouter.put("/update-category/:id", updateCategory);
categoryRouter.delete("/delete-category/:id", deleteCategory);

module.exports = categoryRouter;