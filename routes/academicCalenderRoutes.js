const express = require("express");
const academicCalenderRouter = express.Router();

const { addAcademic, getAllAcademic, getAcademicById, updateAcademic, deleteAcademic } = require("../controllers/academicCalendarController.js");

academicCalenderRouter.post("/add-academic", addAcademic);
academicCalenderRouter.get("/all-academic", getAllAcademic);
academicCalenderRouter.get("/get-academic/:id", getAcademicById);
academicCalenderRouter.put("/update-academic/:id", updateAcademic);
academicCalenderRouter.delete("/delete-academic/:id", deleteAcademic);

module.exports = academicCalenderRouter;