const express = require("express");
const syllabusRouter = express.Router();

const {
  createSyllabus,
  getAllSyllabus,
  getSyllabusById,
  updateSyllabus,
  deleteSyllabus,
  uploadFile,
} = require("../controllers/syllabusController.js");

syllabusRouter.post("/add-syllabus", uploadFile, createSyllabus);
syllabusRouter.get("/all-syllabus", getAllSyllabus);
syllabusRouter.get("/get-syllabus/:id", getSyllabusById);
syllabusRouter.put("/update-syllabus/:id", uploadFile, updateSyllabus);
syllabusRouter.delete("/delete-syllabus/:id", deleteSyllabus);

module.exports = syllabusRouter;
