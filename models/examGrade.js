const mongoose = require("mongoose");

const examGradeSchema = new mongoose.Schema(
    {
        gradeName: { type: String, required: true },
        gradePoint: { type: Number, required: true },
        percentageForm: { type: Number, required: true },
        percentageUpto: { type: Number, required: true },
        remark: { type: String } // Optional field
    },
    { timestamps: true }
);

module.exports = mongoose.model("ExamGrade", examGradeSchema);
