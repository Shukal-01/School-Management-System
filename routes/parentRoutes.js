// parentRoutes.js
const express = require("express");

// Import the parentController
const {
    getAllParent,
    getParentById,
    getParentByStudentId,
    deleteParent,
    updateParent,
    blockParent,
    downloadParents,
} = require("../controllers/parentController.js");

const parentRouter = express.Router();

// Get all parents with filtering and search parentRouter
parentRouter.get("/all-parents", getAllParent);

// Get parent by ID
parentRouter.get("/get-parent/:id", getParentById);

// Get parent by student ID
parentRouter.get("/get-parents/student/:studentId", getParentByStudentId);

// Delete parent by ID
parentRouter.delete("/delete-parent/:id", deleteParent);

// Update parent by ID
parentRouter.put("/update-parent/:id", updateParent);

// Block parent by ID
parentRouter.put("/block-parent/block/:id", blockParent);

// Download parent data as CSV
parentRouter.get("/download-parents", downloadParents);

module.exports = parentRouter;
