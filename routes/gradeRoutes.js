const express = require("express");
const gradeRouter = express.Router();

const { addGrade, getAllGrade, getGradeById, updateGrade, deleteGrade } = require("../controllers/gradeController.js");

gradeRouter.post("/add-grade", addGrade);
gradeRouter.get("/all-grade", getAllGrade);
gradeRouter.get("/get-grade/:id", getGradeById);
gradeRouter.put("/update-grade/:id", updateGrade);
gradeRouter.delete("/delete-grade/:id", deleteGrade);

module.exports = gradeRouter;