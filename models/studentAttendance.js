// models/StudentAttendance.js
const mongoose = require("mongoose");

const studentAttendanceSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        sectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            required: true,
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee", // Since teacher info is stored in Employee model
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        attendanceStatus: {
            type: String,
            enum: ["Present", "Absent"],
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("StudentAttendance", studentAttendanceSchema);
