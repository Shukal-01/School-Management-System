const express = require("express");
const {
    addStudentAttendance,
    getAllStudentAttendance,
    getStudentAttendanceById,
    updateStudentAttendance,
    deleteStudentAttendance,
} = require("../controllers/studentAttendanceController");

const studentAttendanceRouter = express.Router();

studentAttendanceRouter.post("/add-Student-attendance", addStudentAttendance);
studentAttendanceRouter.get("/all-Student-attendance", getAllStudentAttendance);
studentAttendanceRouter.get("/get-Student-attendance/:id", getStudentAttendanceById);
studentAttendanceRouter.put("/update-Student-attendance/:id", updateStudentAttendance);
studentAttendanceRouter.delete("/delete-Student-attendance/:id", deleteStudentAttendance);

module.exports = studentAttendanceRouter;
