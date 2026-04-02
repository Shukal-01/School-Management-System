const mongoose = require("mongoose");

const assignSubjectToTeacherSchema = new mongoose.Schema(
    {
        selectClass: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        subjectName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },
        subjectCode: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            sparse: true // ✅ Allows multiple null values in unique field
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            sparse: true // ✅ Allows multiple null values in unique field
        },
        teacherName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },
        sendNotificationToTeacher: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("AssignSubjectToTeacher", assignSubjectToTeacherSchema);
