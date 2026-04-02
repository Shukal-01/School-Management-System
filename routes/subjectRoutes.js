const express = require("express");
const subjectRouter = express.Router();

const {
  addSubject,
  getAllSubject,
  getSubjectById,
  updateSubject,
  deleteSubject,
  getSubjectsByClass
} = require("../controllers/subjectController.js");

subjectRouter.post("/add-subject", addSubject);
subjectRouter.get("/all-subject", getAllSubject);
subjectRouter.get("/get-subject/:id", getSubjectById);
subjectRouter.put("/update-subject/:id", updateSubject);
subjectRouter.delete("/delete-subject/:id", deleteSubject);
subjectRouter.get("/class/:classId", getSubjectsByClass);

module.exports = subjectRouter;
