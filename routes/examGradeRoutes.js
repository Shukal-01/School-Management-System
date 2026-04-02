const express = require("express");
const examGradeRouter = express.Router();
const {
    addExamGrade,
    getAllExamGrades,
    getExamGradeById,
    updateExamGrade,
    deleteExamGrade,
} = require("../controllers/examGradeController");

// Create a new exam grade
examGradeRouter.post("/add-grade", addExamGrade);

// Get all exam grades
examGradeRouter.get("/all-grades", getAllExamGrades);

// Get an exam grade by ID
examGradeRouter.get("/get-grade/:id", getExamGradeById);

// Update an exam grade by ID
examGradeRouter.put("/update-grade/:id", updateExamGrade);

// Delete an exam grade by ID
examGradeRouter.delete("/delete-grade/:id", deleteExamGrade);

module.exports = examGradeRouter;
