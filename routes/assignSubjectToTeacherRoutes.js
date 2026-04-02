const express = require("express");
const {
    assignSubject,
    getAllAssignedSubjects,
    getAssignedSubjectById,
    updateAssignedSubject,
    deleteAssignedSubject,
} = require("../controllers/assignSubjectToTeacherController");

const assignSubjectRouter = express.Router();

assignSubjectRouter.post("/add-assign-subject", assignSubject);
assignSubjectRouter.get("/all-assign-subject", getAllAssignedSubjects);
assignSubjectRouter.get("/get-assign-subject/:id", getAssignedSubjectById);
assignSubjectRouter.put("/update-assign-subject/:id", updateAssignedSubject);
assignSubjectRouter.delete("/delete-assign-subject/:id", deleteAssignedSubject);

module.exports = assignSubjectRouter;
