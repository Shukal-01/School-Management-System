const mongoose = require("mongoose");

const examScheduleSchema = new mongoose.Schema(
    {
        // Reference to the exam category (from Category model)
        selectExamCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ExamCategory",
            required: true
        },
        // Reference to the subject (from Subject model)
        subjectName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true
        },
        // Maximum marks for the paper
        setMaximumMarksOfPaper: {
            type: Number,
            required: true
        },
        // Reference to the class (from Class model)
        selectClass: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true
        },
        // Reference to the section (from Section model)
        selectSection: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            required: true
        },
        // Time of the exam as a string (for example, "10:00 AM")
        selectTimeStamp: {
            type: String,
            required: true
        },
        // Date of the exam
        selectDate: {
            type: Date,
            required: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ExamSchedule", examScheduleSchema);
