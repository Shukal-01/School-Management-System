const mongoose = require("mongoose");

const extraClassesSchema = new mongoose.Schema(
    {
        selectClass: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true }, // Store class name for quick access
        teacherAssigned: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },
        selectSection: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            required: true,
        },
        selectDays: {
            type: [String],
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            required: true,
        },
        selectTimeStamp: { type: String, required: true }, // e.g., "10:00 AM - 11:00 AM"
        selectDate: { type: Date, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ExtraClasses", extraClassesSchema);
